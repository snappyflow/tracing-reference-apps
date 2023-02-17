import React, {useEffect, useState } from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import { Button } from 'react-native-elements';
import AnimatedFlatList from '../components/AnimatedFlatList';
import CardBook from '../components/CardBook';
import PrimaryHeader from '../components/PrimaryHeader';
import {AnimatedHeading, Text} from '../components/Typos';
import Api from '../helpers/Api';
import {connect} from '../recontext/store';
import {colors, metrics} from '../utils/themes';
import { authService } from '../services/authService';
import { ListItem, Avatar, Icon } from 'react-native-elements'

const LOGO_SIZE = 24;
const PAGE_SIZE = 10;

function HomeScreen () {
    const [expandedProject, setExpandedProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [contentOffset, _] = useState(new Animated.Value(0));
    useEffect(() => {
      setTimeout(() => {
        fetchProjects();
      }, 200);

      setInterval(() => {
        fetchProjects();
      }, 3000)
    }, []);

    const fetchProjects = async () => {
      const projectList = await authService.fetchProjects();
      // console.log('projectList', projectList);
      setProjects(projectList.projects);
    }
    return (
      <View style={styles.container}>
        {/* <AnimatedFlatList
          data={projects}
          keyExtractor={(item, index) => index.toString()}
          // ListHeaderComponent={<View style={styles.headerComponent} />}
          renderItem={({item, index}) => (
            <CardBook
              item={item}
              index={index % PAGE_SIZE}
              onPress={() =>
                navigation.navigate('InventoryScreen', {
                  id: item.id,
                  item: item,
                })
              }
            />
            // <Title numberOfLines={2}>{item.project_name}</Title>
          )}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {contentOffset: {y: contentOffset}},
              },
            ],
            {useNativeDriver: true},
          )}
        /> */}
        {projects.map((project, i) => (
          <ListItem.Accordion
          key={project.id}
          content={
            <>
              {/* <Icon name="place" size={30} /> */}
              <ListItem.Content>
                <ListItem.Title>{project.project_name}</ListItem.Title>
              </ListItem.Content>
            </>
          }
          isExpanded={project.project_name == expandedProject}
          onPress={() => {
            // setExpanded(!expanded);
            if (project.project_name == expandedProject) {
              setExpandedProject(null)
            }
            else {
              setExpandedProject(project.project_name)
            }
          }}
        >
          {project.applications.map((application, i) => (
            <ListItem key={application.id} onPress={() => {}} bottomDivider>
              {/* <Avatar title={l.name[0]} source={{ uri: l.avatar_url }} /> */}
              <ListItem.Content>
                <ListItem.Title>{application.application_name}</ListItem.Title>
                {/* <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle> */}
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          ))}
        </ListItem.Accordion>
        ))}
        
      </View>
    );
}

const mapStateToProps = state => ({
  books: state.books,
  quotes: state.quotes,
});

export default connect(mapStateToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  headerTitle: {
    position: 'absolute',
    bottom: 0,
    width: metrics.screenWidth,
    padding: metrics.lessPadding,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerText: {
    position: 'absolute',
    bottom: 0,
    width: metrics.screenWidth,
    paddingHorizontal: metrics.extraPadding,
    paddingVertical: metrics.lessPadding,
  },
  // logo: {
  //   width: LOGO_SIZE,
  //   height: LOGO_SIZE,
  //   marginHorizontal: metrics.lessPadding,
  // },
  textWhite: {
    color: colors.white,
  },
  list: {
    flex: 1,
  },
  headerComponent: {
    height: metrics.headerHeightX2,
  },
});
