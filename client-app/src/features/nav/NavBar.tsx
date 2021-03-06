import React, { useContext } from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';
import ActivityStore from '../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';


const NavBar: React.FC = () => 
{
    const activity_store = useContext(ActivityStore);
    const { openCreateForm } = activity_store;
    return (
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}/>
            Reactivites
          </Menu.Item>
          <Menu.Item name="messages" />
          <Menu.Item>
                    <Button positive content="Create Activity"
                            onClick={openCreateForm} />
          </Menu.Item>
        </Container>
      </Menu>
    );
    
}

export default observer(NavBar);
