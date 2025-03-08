import Header from './header'
import Stats from './stats'
import TypeProvider from '@/context/typeprovider'
import Placeholder from './placeholder/placeholder'

export default function Layout() {
    return (
        <>
            <Header />
            <TypeProvider>
                <Stats />
                <Placeholder />
            </TypeProvider>
        </>
    )
}
