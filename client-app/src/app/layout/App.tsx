import React, {useState, useEffect, Fragment, SyntheticEvent} from 'react';
import { Container } from 'semantic-ui-react';
import { IActivity } from './../models/activity';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import api from '../api/api';
import LoadingSpin from './LoadingSpin';



const App = () => 
{
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [target, setTarget] = useState<string>(''); //represent the name of the del button clicked

    const handleSelectActivity = (id: string) =>
    {
        setSelectedActivity(activities.filter(a => a.id === id)[0]);
        setEditMode(false);
    };

    const handleOpenCreateForm = () =>
    {
        setSelectedActivity(null);
        setEditMode(true);
    };

    const handleCreateActivity = (activity: IActivity) =>
    {
        setSubmitting(true);
        api.Activities.create(activity).then(() =>
        {
            setActivities([...activities, activity]);
            setSelectedActivity(activity);
            setEditMode(false);
        }).then(() => setSubmitting(false));
        
    };

    const handleEditActivity = (activity: IActivity) =>
    {
        setSubmitting(true);
        api.Activities.update(activity).then(() =>
        {
            setActivities([...activities.filter(a => a.id !== activity.id), activity]);
            setSelectedActivity(activity);
            setEditMode(false);
        }).then(() => setSubmitting(false));
        
    };

    const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) =>
    {
        setSubmitting(true);
        setTarget(event.currentTarget.name);
        api.Activities.delete(id).then(() =>
        {
            setActivities([...activities.filter(a => a.id !== id)]);
        }).then(() => setSubmitting(false));
        
    };

    useEffect(() =>
    {
        api.Activities.list()
        .then((response) =>
        {
            let activities: IActivity[] = [];
            response.forEach(activity =>
            {
                activity.date = activity.date.split('.')[0];
                activities.push(activity);
            });
            setActivities(activities);
        }).then(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSpin content='Loading activities...' />

    return (
        <Fragment>
            <NavBar openCreateForm={handleOpenCreateForm} />
            <Container style={{ marginTop: '7em' }}>
                <ActivityDashboard activities={activities}
                    selectActivity={handleSelectActivity}
                    selectedActivity={selectedActivity}
                    editMode={editMode}
                    setEditMode={setEditMode}
                    setSelectedActivity={setSelectedActivity}
                    createActivity={handleCreateActivity}
                    editActivity={handleEditActivity}
                    deleteActivity={handleDeleteActivity}
                    submitting={submitting}
                    target={target}/>
        </Container> 
    </Fragment>
    );
  
}

export default App;

