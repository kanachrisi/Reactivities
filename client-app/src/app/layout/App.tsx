import React, {useEffect, Fragment, useContext} from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingSpin from './LoadingSpin';
import ActivityStore from '../stores/activityStore';
import { observer } from 'mobx-react-lite';


const App = () => 
{
    const activityStore = useContext(ActivityStore);
   
    useEffect(() =>
    {
        activityStore.loadActivities();

    }, [activityStore]);

    if (activityStore.loadingIndicator) return <LoadingSpin content='Loading activities...' />

    return (
        <Fragment>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
                <ActivityDashboard />
        </Container> 
    </Fragment>
    );
  
}

export default observer(App);

