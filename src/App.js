import React, {useEffect, useState} from 'react';

function App() {
    const [balance, setBalance] = useState(0);
    const [withdrawAmount, setWithdrawAmount] = useState(10);
    const [receiveAmount, setReceiveAmount] = useState(0);

    const getBalance = async () => {
        try {
            const response = await fetch('http://localhost:3001/balance');
            const data = await response.json();
            console.log(data);
            setBalance(data.balance);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getBalance();
    }, [balance])

    const postWithdrawAmount = async () => {
        try {
            const response = await fetch(`http://localhost:3001/receive-amount`, {
                crossDomain: true,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({withdrawAmount: withdrawAmount})
            });
            const data = await response.json();
            setReceiveAmount(data.receiveAmount);
            // console.log(data);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        postWithdrawAmount();
    }, []);

    const postReceiveAmount = async () => {
        try {
            const response = await fetch(`http://localhost:3001/withdraw-amount`, {
                crossDomain: true,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({receiveAmount: receiveAmount})
            });
            const data = await response.json();
            // console.log(response)
            setWithdrawAmount(data.withdrawAmount);
            // console.log(data);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        postReceiveAmount();
    }, [])

    const submitWhithdraw = async () => {
        try {
            if (receiveAmount < 0 || withdrawAmount > balance) {
                alert("You can't withdraw this amount of money")
            } else {
                const response = await fetch(`http://localhost:3001/withdraw`, {
                    crossDomain: true,
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({withdrawAmount: withdrawAmount}),
                });
                const data = await response.json();
                // console.log(response)
                console.log(data);
                getBalance();
            }
        } catch (error) {
            console.log(error)
        }
    }

    // console.log(typeof (receiveAmount))
    // console.log(receiveAmount)
    // console.log(withdrawAmount)
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="App container">
            <h4>Your balance: {balance} €</h4>
            {(receiveAmount < 0 || withdrawAmount > balance) ? <div className="alert alert-danger" role="alert">
                Your receive amount is negative or Your balance is too small
            </div> : false}
            <form className="mt-4" onSubmit={handleSubmit}>
                <div className="row d-flex justify-content-center">
                    <div className="form-group mr-3">
                        <label className="">Withdraw amount input</label>
                        <input type="number"
                               className="form-control"
                               name="withdrawAmount"
                               placeholder="Enter sum you want withdraw"
                               value={withdrawAmount}
                               onChange={(e) => setWithdrawAmount(e.target.value)}
                               onKeyUp={postWithdrawAmount}
                        />
                    </div>
                    <div className="form-group mr-3">
                        <label className="">Receive amount input</label>
                        <input type='number'
                               className="form-control"
                               name="receiveAmount"
                               placeholder="Enter sum you want receive"
                               value={receiveAmount}
                               onChange={(e) => setReceiveAmount(e.target.valueAsNumber)}
                               onKeyUp={postReceiveAmount}
                        />
                    </div>
                </div>
                <div className="row d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary align-self-center"
                            onClick={submitWhithdraw}>Submit withdraw amount
                    </button>
                </div>
            </form>
        </div>
    );
}

export default App;
