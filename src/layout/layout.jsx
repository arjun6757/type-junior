import Header from './header';
// import TypeProvider from '@/context/typeprovider';
import ActionsProvider from '@/context/ActionsProvider';
import MainView from './MainView';

export default function Layout() {
    return (
        <div className='h-full'>
            <Header />

            {/* <TypeProvider> */}
                <ActionsProvider>
                    <MainView />
                </ActionsProvider>
            {/* </TypeProvider> */}
        </div>
    )
}
