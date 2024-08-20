import Verify from '@/components/auth/verify'
import React from 'react'

function VerifyPage({ params }: { params: { id: string } }) {
    return (
        <div>
            <Verify id={params.id} />
        </div>
    )
}

export default VerifyPage
