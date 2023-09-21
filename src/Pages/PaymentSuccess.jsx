import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const PaymentSuccess = () => {
    const [queryParameters] = useSearchParams()
    const [message, setMessage] = useState("")
    const navigation = useNavigate()
    useEffect(() => {
        // api request to check the payment status payment intent
        const checkStatus = async () => {
            const intent = queryParameters.get('payment_intent')
            const orderID = queryParameters.get('order_id')
            console.log(intent, orderID);
            const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/check-payment-status`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ intent, orderID })
            })
            const response = await r.json()
            if (response.success) {
                setMessage("Your order was succesfully placed. You are being redirected to orders page...")

                // setTimeout(() => {
                //     navigation('../dashboard/orders')
                // }, 4000)
            }

        }
        checkStatus()
    }, [])

    return (
        <center><h3>{message}</h3></center>
    )
}

export default PaymentSuccess