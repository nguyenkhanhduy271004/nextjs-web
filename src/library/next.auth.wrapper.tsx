'use client'

import { SessionProvider } from 'next-auth/react'
function NextAuthWrapper({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}

export default NextAuthWrapper
