from pyteal import *
import program

def approval():
    local_opponent = Bytes("opponent") 
    local_hash_hand = Bytes("hashedhand")
    local_real_hand = Bytes("realhand") 
    local_real_guess = Bytes("realguess") 
    local_hash_guess = Bytes("hashedguess")
    local_wager = Bytes("wager") # uint64

    # operations
    op_start = Bytes("start") 
    op_resolve = Bytes("resolve")
    op_accept = Bytes("accept")

    @Subroutine(TealType.none) 
    def get_ready(account: Expr):
        return Seq(
            App.localPut(account,local_opponent,Bytes("")),
            App.localPut(account,local_hash_hand,Bytes("")),
            App.localPut(account,local_real_hand,Int(0)),
            App.localPut(account,local_wager,Int(0)),
            App.localPut(account,local_hash_guess,Bytes("")),
            App.localPut(account,local_real_guess,Int(0))

    )
    # in this case, sender is player B
    @Subroutine(TealType.none)
    def accept_game():
        return Seq(
            perform_checks,
            Assert(
                And(
                    check_if_empty(Txn.sender())
                )
                ),
            
            App.localPut(Txn.sender(), local_opponent, Txn.accounts[1]),
            App.localPut(Txn.sender(), local_real_hand, Btoi(Txn.application_args[1])),
            App.localPut(Txn.sender(), local_wager, Gtxn[1].amount()),
            App.localPut(Txn.sender(), local_real_guess, Btoi(Txn.application_args[2])),

            Approve()
        )
    

    
    @Subroutine (TealType.uint64) 
    def check_if_empty(account: Expr):
        return Return(  
            And(
                App.localGet(account,local_opponent)==Bytes(""),
                App.localGet(account,local_hash_hand)==Bytes(""),
                App.localGet(account,local_real_hand)==Int(0),
                App.localGet(account,local_wager)==Int(0),
                App.localGet(account,local_hash_guess)==Bytes(""),
                App.localGet(account,local_real_guess)==Int(0),

            )
    )

    perform_checks = Assert(
        And(
            Global.group_size() == Int(2),
            # check if the current transaction is the first one
            Txn.group_index() == Int (0),
            Gtxn[1].type_enum() == TxnType.Payment,
            Gtxn[1].receiver() == Global.current_application_address(),
            Gtxn[0].rekey_to() == Global.zero_address(),
            Gtxn[1].rekey_to() == Global.zero_address(),
            App.optedIn(Txn.accounts [1], Global.current_application_id()),

        )
    )

    @Subroutine(TealType.none)
    def start_game():
    	return Seq(
            perform_checks,
             Assert(
                 And(
                    #Player A
                    check_if_empty(Txn.sender()),
                    #Player B
                    check_if_empty(Txn.accounts[1])


                )
            ),
	        App.localPut(Txn.sender(), local_opponent, Txn.accounts[1]),
	        App.localPut(Txn.sender(), local_hash_hand, Txn.application_args[1]),
	        App.localPut(Txn.sender(), local_wager, Gtxn[1].amount()), 
            App.localPut(Txn.sender(), local_hash_guess, Txn.application_args[2]),

            Approve()
        )
    


    @Subroutine (TealType.uint64) 
    def tranform_hand(hand: Expr): 
        return Return(
            Cond(
                [hand == Bytes("rock"), Int(0)],
                [hand == Bytes("paper"), Int(1)],
                [hand == Bytes("scissors"), Int(2)],
         ),
    )
    

    @Subroutine (TealType.none)
    def transfer_wager (acc_index: Expr, wager: Expr): 
        return Seq(
            InnerTxnBuilder.Begin(),

            InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment, 
            TxnField.receiver: Txn.accounts[acc_index],
            TxnField.amount: wager
            }),

            InnerTxnBuilder.Submit()
        
        )



    @Subroutine (TealType.none)
    def calc_winner(hand_a: Expr,hand_b: Expr, guess_a: Expr,guess_b: Expr, wager: Expr):
        return Seq(
            If(
                guess_a == guess_b
                )
            .Then(
                Seq(
                    transfer_wager(Int(0),wager),
                    transfer_wager(Int(1),wager)

                )
            )
        .ElseIf(
            # Both guesses are wrong 
            And(
                    (hand_a + hand_b)!=guess_a,
                    (hand_a + hand_b)!=guess_b
                )

        )
        .Then(
             Seq(
                    transfer_wager(Int(0),wager),
                    transfer_wager(Int(1),wager)

                )
        )
        .ElseIf(
                #Player b wins
                (hand_a + hand_b) == guess_b
            )
            .Then(
                transfer_wager(Int(1), wager*Int(2))
            )



        .Else(
        # player a wins
            transfer_wager(Int(0), wager*Int(2))

        
            )
        )
        # This operation is executed by player Alice
    @Subroutine (TealType.none)
    def resolve_game():
        hand_a = ScratchVar(TealType.uint64)
        hand_b = ScratchVar(TealType.uint64)
        guess_a = ScratchVar(TealType.uint64)
        guess_b = ScratchVar(TealType.uint64)
        wager = ScratchVar(TealType.uint64)
    
        return Seq(
            Assert(
                And(
                    Global.group_size() == Int(1),
                    # check if the current transaction is the first one 
                    Txn.group_index() == Int(0),
                    Gtxn[0].rekey_to() == Global.zero_address(),
                    # check if wagers are the same 
                    App.localGet(Txn.accounts [1], local_wager) == App.localGet(Txn.accounts[0], local_wager),
                    # Check if player a`s hand and guess are valid
                    App.localGet(Txn.sender(),local_hash_hand) == Sha256(Txn.application_args[1]),
                    App.localGet(Txn.sender(),local_hash_guess) == Sha256(Txn.application_args[2]),
                    Txn.application_args.length() == Int(3),


                    )
                ),


                # `transform` strings to ints
            hand_a.store(App.localGet(Txn.accounts[0],local_real_hand)),
            hand_b.store(App.localGet(Txn.accounts[1],local_real_hand)),
            guess_a.store(App.localGet(Txn.accounts[0],local_real_guess)),
            guess_b.store(App.localGet(Txn.accounts[1],local_real_guess)),
            wager.store(App.localGet(Txn.accounts[0],local_wager)),

            calc_winner(hand_a.load(), hand_b.load(), guess_a.load(), guess_b.load(), wager.load()),
            Approve()
        )
        
    



    return program.event(
        init=Approve(),
        opt_in=Seq(
            get_ready(Txn.sender()),
            
            Approve()
        ),

        no_op=Seq(
            Cond(
                [Txn.application_args[0] == op_start, start_game()],
                [Txn.application_args[0] == op_accept, accept_game()],
                [Txn.application_args[0] == op_resolve, resolve_game()]
            ),
    Reject()
)
)
def clear():
    return Approve()