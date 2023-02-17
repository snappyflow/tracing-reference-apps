import React, {Component} from 'react';
import {Animated, FlatList, StatusBar, StyleSheet, View} from 'react-native';
import CardBook from '../components/CardBook';
import FooterSpace from '../components/FooterSpace';
import Header from '../components/Header';
import {Heading} from '../components/Typos';
import Api from '../helpers/Api';
import {connect} from '../recontext/store';
import {colors, metrics} from '../utils/themes';

import {startTransaction} from 'sf-apm-rum-react-native'
const PAGE_SIZE = 10;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class CategoryScreen extends Component {
  constructor(props) {
    super(props);
    this._contentOffset = new Animated.Value(0);
    this._title = props.route.params.category.name;
  }

  componentDidMount() {
    StatusBar.setBarStyle('dark-content', true);
    Api.searchBooks();
  }

  componentWillUnmount() {
    StatusBar.setBarStyle('light-content', true);
  }

  render() {
    const {navigation, search_books} = this.props;
    return (
      <View style={styles.container}>
        <AnimatedFlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={search_books}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.title}>
              <Heading>{'Genres: ' + this._title}</Heading>
            </View>
          }
          ListFooterComponent={<FooterSpace />}
          renderItem={({item, index}) => (
            <CardBook
              item={item}
              index={index % PAGE_SIZE}
              onPress={() =>{
                // const transaction = startTransaction('click', 'user-interaction')
                // const span = transaction.startSpan('bookscreen', 'route-change')
                 navigation.navigate('BookScreen', {
                  id: item.id,
                  item: item,
                })
                fetch(`https://jsonplaceholder.typicode.com/todos/${Math.round(Math.random() * 100)}`)
                .then((response) => response.json())
                .then((json) => {
                  console.log(json);
                  // span.end()
                  // transaction.end();
                  // return json.movies;
                })
                .catch((error) => {
                  console.error(error);
                });
                
              }}
            />
          )}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {contentOffset: {y: this._contentOffset}},
              },
            ],
            {useNativeDriver: true},
          )}
        />
        <Header
          hasBackButton
          title={this._title}
          animatedY={this._contentOffset.interpolate({
            inputRange: [0, 70],
            outputRange: [60, 0],
            extrapolate: 'clamp',
          })}
          animatedOpacity={this._contentOffset.interpolate({
            inputRange: [0, 60, 70],
            outputRange: [0, 0.3, 1],
            extrapolate: 'clamp',
          })}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  search_books: state.search_books,
});

export default connect(mapStateToProps)(CategoryScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: metrics.headerHeight,
  },
  list: {
    justifyContent: 'center',
    padding: metrics.lessPadding,
  },
  title: {},
});
