import React, { Component } from 'react';
import Auxilary from '../Auxilary/Auxilary';
import classes from "./Layout.css";
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'
import { connect } from 'react-redux';

class Layout extends Component {

    state = {
        showSideDrawer: false
    }
    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer: false})
    }

    sideDrawerToggleHandler = () => {
        this.setState( (prevState) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        });
    }

    render() {
        return (
            <Auxilary>
                <Toolbar
                    isAuth={this.props.isAuthenticated}
                    drawerToggleClicked={this.sideDrawerToggleHandler}/>
                <SideDrawer
                    open={this.state.showSideDrawer}
                    isAuth={this.props.isAuthenticated}
                    closed={this.sideDrawerClosedHandler}></SideDrawer>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Auxilary>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
    }
};

export default connect(mapStateToProps)(Layout);
