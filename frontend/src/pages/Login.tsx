import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { Container } from '../components/layout/Container'

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            // Redirect to dashboard on success
            navigate('/admin/dashboard')
        }
    }

    return (
        <Container className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <Card className="w-full max-w-md p-8 bg-white/90 backdrop-blur-lg border-white/20 shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Espace Admin</h1>
                    <p className="text-sm text-gray-500 mt-2">Connectez-vous pour gérer les rendez-vous</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="admin@therapiemaroc.com"
                        autoComplete="email"
                    />
                    <Input
                        label="Mot de passe"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        autoComplete="current-password"
                    />

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full text-base py-6" isLoading={loading}>
                        Se connecter
                    </Button>
                </form>
            </Card>
        </Container>
    )
}
