
import React, { useState, FormEvent, useContext } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';


interface IProps
{
    activity: IActivity;
}

const ActivityForm: React.FC<IProps> = ({ activity: initalFormState}) =>
{
    const activity_store = useContext(ActivityStore);
    const { createActivity, editActivity, submittingIndicator, cancelFormOpen } = activity_store;
    const initializeForm = () =>
    {
        if (initalFormState)
        {
            return initalFormState;
        }
        else
        {
            return {
                id: '',
                title: '',
                category: '',
                description: '',
                date: '',
                city: '',
                venue: ''
            }
        }
    };

    const [activity, setActivity] = useState<IActivity>(initializeForm);

    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    {
        const { name, value } = event.currentTarget;
        setActivity({ ...activity, [name]: value});
    };

    const handleSubmit = () =>
    {
        if (activity.id.length === 0)
        {
            let new_activity = { ...activity, id: uuid()};
            createActivity(new_activity);
        }
        else
        {
            editActivity(activity);
        }
    };

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange} />
                <Form.TextArea rows={2} placeholder='Description' value={activity.description} name='description' onChange={handleInputChange} />
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange} />
                <Form.Input type='datetime-local' placeholder='Date' value={activity.date} name='date' onChange={handleInputChange} />
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange} />
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange} />
                <Button floated='right' positive type='submit' content='Submit' loading={submittingIndicator} />
                <Button onClick={cancelFormOpen} floated='right' type='button' content='Cancel' />
            </Form>   
        </Segment>
    );
}

export default observer(ActivityForm);