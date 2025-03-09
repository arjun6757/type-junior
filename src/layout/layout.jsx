import Header from './header'
import Stats from './stats'
import TypeProvider from '@/context/typeprovider'
import Placeholder from './placeholder/placeholder'
import Bottombar from './bottombar'
import ActionsProvider from '@/context/ActionsProvider'
import MainView from './MainView'

export default function Layout() {
    return (
        <>
            <Header />

            <TypeProvider>
                <ActionsProvider>
                    <MainView />
                </ActionsProvider>
            </TypeProvider>
        </>
    )
}
