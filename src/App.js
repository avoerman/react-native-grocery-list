import React from 'react';
import { StackNavigator } from 'react-navigation';
import ShoppingList from './screens/ShoppingList';
import AddProduct from './screens/AddProduct';

const Navigator = StackNavigator({
    ShoppingList: { screen: ShoppingList },
    AddProduct: { screen: AddProduct }
});

export default class App extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <Navigator/>;
    }
}