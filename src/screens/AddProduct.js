import React from 'react';
import { Container, ListItem, List, Body, Text, Right, Icon, Content, Fab } from 'native-base';
import { AsyncStorage } from 'react-native';
import prompt from 'react-native-prompt-android';

export default class AddProduct extends React.Component {
    static navigationOptions = {
        title: 'Add a product'
    };

    constructor(props) {
        super(props);

        this.state = {
            allProducts: [],
            productsInList: []
        };
    }

    async componentWillMount() {
        const savedProducts = await AsyncStorage.getItem('@allProducts');
        if (savedProducts) {
            this.setState({
                allProducts: JSON.parse(savedProducts)
            });
        } else {
            this.setState({
                allProducts: JSON.parse([
                    { id: 1, name: 'bread' },
                    { id: 2, name: 'sandwich meat' },
                    { id: 3, name: 'cheese' },
                    { id: 4, name: 'yogurt' },
                    { id: 5, name: 'pizza' }
                ])
            });
        }

        this.setState({
            productsInList: this.props.navigation.state.params.productsInList
        });
    }


    async addNewProduct(name) {
        if (this.state.allProducts.some(p => p.name.toLowerCase() === name.toLowerCase())) {
            return;
        }
        const newProductsList = this.state.allProducts.concat({
            name: name,
            id: Math.floor(Math.random() * 1000000)
        });

        await AsyncStorage.setItem('@allProducts', JSON.stringify(newProductsList));

        this.setState({
            allProducts: newProductsList
        });
    }

    async _onRemovePress(product) {
        this.setState({
            allProducts: this.state.allProducts.filter(p => p.id !== product.id)
        });

        await AsyncStorage.setItem('@allProducts',
            JSON.stringify(this.state.allProducts.filter(p => p.id !== product.id)));

    }

    _onAddProductPress() {
        prompt(
            'Enter product name',
            '',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: this.addNewProduct.bind(this) }
            ],
            { type: 'plain-text' });
    }


    _onProductPress(product) {
        const alreadyExists = this.state.productsInList.some(p => p.id === product.id);

        if (alreadyExists) {
            this.setState({
                productsInList: this.state.productsInList.filter(p => p.id !== product.id)
            });
            this.props.navigation.state.params.deleteProduct(product);
        } else {
            this.setState({
                productsInList: this.state.productsInList.concat(product)
            });
            this.props.navigation.state.params.addProduct(product);
        }
    }

    render() {
        return (
            <Container>
                <Content>
                    <List>
                        {
                            this.state.allProducts.map(product => {
                                const productIsInList = this.state.productsInList.find(p => p.id === product.id);
                                return (
                                    <ListItem key={product.id}
                                              onPress={this._onProductPress.bind(this, product)}>
                                        <Body>
                                        <Text style={{ color: productIsInList ? '#bbb' : '#000' }}>{product.name}</Text>
                                        {
                                            productIsInList &&
                                            <Text note>
                                                {'Already in shopping list'}
                                            </Text>
                                        }
                                        </Body>
                                        <Right>
                                            <Icon ios="ios-remove-circle"
                                                  android="md-remove-circle"
                                                  style={{ color: 'red' }}
                                                  onPress={this._onRemovePress.bind(this, product)}
                                            />
                                        </Right>
                                    </ListItem>
                                );
                            })
                        }
                    </List>
                </Content>
                <Fab style={{ backgroundColor: '#5067FF' }}
                     position="bottomRight"
                     onPress={this._onAddProductPress.bind(this)}>
                    <Icon name="add"/>
                </Fab>
            </Container>
        );
    }
}
