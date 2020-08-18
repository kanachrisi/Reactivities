import React, { useContext } from 'react';
import { Item, Segment, Button, Label } from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';


const ActivityList: React.FC = () =>
{
    const activityStore = useContext(ActivityStore);
    const { activitiesByDate, selectActivity, deleteActivity, submittingIndicator, target } = activityStore;
    return (
        <Segment clearing>
            <Item.Group divided>
                {activitiesByDate.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>

                            <Item.Extra>
                                <Button
                                    floated='right'
                                    content='View'
                                    color='blue'
                                    onClick={() => selectActivity(activity.id)}
                                />
                                <Button
                                    name={activity.id}
                                    floated='right'
                                    content='Delete'
                                    color='red'
                                    loading={target === activity.id && submittingIndicator}
                                    onClick={(e) => deleteActivity(e, activity.id)}
                                />
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
     );
}

export default observer(ActivityList);
