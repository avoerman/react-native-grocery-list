import React from 'react';
import { Alert, AsyncStorage } from 'react-native';
import {
    List,
    Content,
    Container,
    ListItem,
    Body,
    Text,
    Right,
    CheckBox,
    Fab,
    Icon,
    View
} from 'native-base';

export default class ShoppingList extends React.Component {
    static navigationOptions = {
        title: 'Alex\'s Grocery List'
    };

    constructor(props) {
        super(props);
        this.state = {
            products: []
        };
    }

    async componentWillMount() {
        const savedList = await AsyncStorage.getItem('@productList');
        if (savedList) {
            this.setState({
                products: JSON.parse(savedList)
            });
        }
    }

    _onProductPress(product) {
        const newState = this.state.products.map(p => {
            return { ...p, gotten: (p.id === product.id) ? !p.gotten : p.gotten };
        });
        AsyncStorage.setItem('@productList', JSON.stringify(newState)).then(() => {
            this.setState({ products: newState });
        });
    }

    _onAddPress() {
        this.props.navigation.navigate('AddProduct', {
            addProduct: product => {
                const newProductList = this.state.products.concat(product);
                AsyncStorage.setItem('@productList', JSON.stringify(newProductList)).then(() => {
                    this.setState({
                        products: newProductList
                    });
                });

            },
            deleteProduct: product => {
                const newProductList = this.state.products.filter(p => p.id !== product.id);
                AsyncStorage.setItem('@productList', JSON.stringify(newProductList)).then(() => {
                    this.setState({
                        products: newProductList
                    });
                });
            },
            productsInList: this.state.products
        });
    }

    _onClearPress() {
        Alert.alert('Clear all items?', null, [
            { text: 'Cancel' },
            { text: 'Ok', onPress: () => this.setState({ products: [] }) }
        ]);
    }

    render() {
        return (
            <Container>
                <Content>
                    {
                        this.state.products.length < 1 &&
                        <Text style={{
                            marginVertical: 15,
                            alignSelf: 'center'
                        }}>There are no items currently in your list!!!</Text>
                    }
                    <List>
                        {
                            this.state.products.map(p => {
                                return (
                                    <ListItem key={p.id} onPress={this._onProductPress.bind(this, p)}>
                                        <Body>
                                        <Text style={{ color: p.gotten ? '#bbb' : '#000' }}>{p.name}</Text>
                                        </Body>
                                        <Right>
                                            <CheckBox checked={p.gotten}
                                                      onPress={this._onProductPress.bind(this, p)}/>
                                        </Right>
                                    </ListItem>
                                );
                            })
                        }
                    </List>
                </Content>
                <Fab style={{ backgroundColor: '#4633dc' }} position="bottomRight"
                     onPress={this._onAddPress.bind(this)}>
                    <Icon name="add"></Icon>
                </Fab>
                <Fab style={{ backgroundColor: 'red' }} position="bottomLeft"
                     onPress={this._onClearPress.bind(this)}>
                    <Icon ios="ios-remove" android="md-remove"/>
                </Fab>
            </Container>
        );
    }
}