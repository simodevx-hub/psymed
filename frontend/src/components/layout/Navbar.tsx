import { Link } from 'react-router-dom'
import { Container } from './Container'
import { Button } from '../ui/Button'

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <Container className="flex h-16 items-center justify-between">
                <Link to="/" className="text-xl font-bold text-primary-600 font-sans tracking-tight">
                    TherapieMaroc
                </Link>
                <div className="flex items-center gap-4">
                    <Link to="/rdv" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                        Prendre RDV
                    </Link>
                    <Link to="/admin">
                        <Button variant="ghost" size="sm">Espace Thérapeute</Button>
                    </Link>
                </div>
            </Container>
        </nav>
    )
}
