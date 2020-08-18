import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import api from '../api/api';

configure({ enforceActions: 'always' });

class ActivityStore
{
    @observable activityRegistry = new Map();
    @observable activities: IActivity[] = [];
    @observable selectedActivity: IActivity | undefined = undefined;
    @observable loadingIndicator = false;
    @observable editMode = false;
    @observable submittingIndicator = false;
    @observable target = ''; //represent the name of the del button clicked

    @computed get activitiesByDate()
    {
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    };

    @action loadActivities = async () =>
    {
        this.loadingIndicator = true;

        try
        {
            const activities = await api.Activities.list();
            runInAction(() =>
            {
                activities.forEach(activity =>
                {
                    activity.date = activity.date.split('.')[0];
                    this.activityRegistry.set(activity.id, activity);
                });
            });
            
        }
        catch (error)
        {
            console.log(error);
        }
        finally
        {
            runInAction(() =>
            {
                this.loadingIndicator = false
            });
            
        }

    };

    @action createActivity = async (activity: IActivity) =>
    {
        this.submittingIndicator = true;

        try
        {
            await api.Activities.create(activity);
            runInAction(() =>
            {
                this.activityRegistry.set(activity.id, activity);
                this.editMode = false;
            });
            
        }
        catch (error)
        {
            console.log(error);
        }
        finally
        {
            runInAction(() =>
            {
                this.submittingIndicator = false;
            });
        }
    };

    @action editActivity = async (activity: IActivity) =>
    {
        this.submittingIndicator = true;
        try
        {
            await api.Activities.update(activity);
            runInAction(() =>
            {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
            });
            
        }
        catch (error)
        {
            console.log(error);
        }
        finally
        {
            runInAction(() =>
            {
                this.submittingIndicator = false;
            });
        }
    };

    @action openCreateForm = () =>
    {
        this.editMode = true;
        this.selectedActivity = undefined;
    };

    @action openEditForm = (id: string) =>
    {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = true;
    };

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) =>
    {
        this.submittingIndicator = true;
        this.target = event.currentTarget.name;

        try
        {
            await api.Activities.delete(id);
            runInAction(() =>
            {
                this.activityRegistry.delete(id);
            });
            
            
        }
        catch (error)
        {
            console.log(error);
        }
        finally
        {
            runInAction(() =>
            {
                this.submittingIndicator = false;
                this.target = '';
            });  
        }
    };

    @action cancelSelectedActivity = () =>
    {
        this.selectedActivity = undefined;
    };

    @action cancelFormOpen = () =>
    {
        this.editMode = false;
    };

    @action selectActivity = (id: string) =>
    {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = false;
    }
}

export default createContext(new ActivityStore());