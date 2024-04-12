import styles from "./page.module.css";
import { InferGetStaticPropsType } from 'next'
import { useState, useEffect } from 'react';
import { map, get, filter, reduce, range, maxBy, minBy, first, last } from 'lodash';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

type DataTasks = [{
  isShow?: boolean;
  vegetable?: boolean;
  fruit?: boolean;
  time?: string;
  type: string;
  name: string;
}];

type Datareset = {
  isShow?: boolean;
  vegetable?: boolean;
  fruit?: boolean;
  time?: string;
  type: string;
  name: string;
}

interface RootObject {
  male: number;
  female: number;
  ageRange: string;
  hair: Hair;
  addressUser: Array<string>;
}

interface Hair {
  Black: number;
  Blond: number;
  Chestnut: number;
  Brown: number;
}

export async function getStaticProps() {
  // const res = await fetch('https://.../posts')
  // const posts: DataTasks[] = await res.json()

  const res = await fetch('https://dummyjson.com/users');
  const swapis = await res.json();

  const data = [{
    type: 'Fruit',
    name: 'Apple',
  },
  {
    type: 'Vegetable',
    name: 'Broccoli',
  },
  {
    type: 'Vegetable',
    name: 'Mushroom',
  },
  {
    type: 'Fruit',
    name: 'Banana',
  },
  {
    type: 'Vegetable',
    name: 'Tomato',
  },
  {
    type: 'Fruit',
    name: 'Orange',
  },
  {
    type: 'Fruit',
    name: 'Mango',
  },
  {
    type: 'Fruit',
    name: 'Pineapple',
  },
  {
    type: 'Vegetable',
    name: 'Cucumber',
  },
  {
    type: 'Fruit',
    name: 'Watermelon',
  },
  {
    type: 'Vegetable',
    name: 'Carrot',
  }];

  const sentData = map(data, (e) => {
    return { ...e, isShow: true, vegetable: false, fruit: false, time: '' };
  });

  return {
    props: {
      data: sentData,
      swapis
    },
  }
}




function Home({ data, swapis }: InferGetStaticPropsType<typeof getStaticProps>) {

  const [tasksArray, setTasksArray] = useState<DataTasks | undefined>();
  const [tasksFruit, setTasksFruit] = useState<DataTasks>();
  const [tasksVegetable, setTasksVegetable] = useState<DataTasks>();
  const [storeCount, setStoreCount] = useState<boolean>(false);
  const [userData, setUserData] = useState<RootObject>();


  useEffect(() => {
    let male;
    let female;
    let black;
    let blond;
    let chestnut;
    let brown;

    const gende = genderCount(swapis.users);
    const hair = hairCount(swapis.users);
    const max = maxBy(swapis.users, 'age');
    const min = minBy(swapis.users, 'age');
    const rangeAge = range(min.age, max.age);

    male = gende.male;
    female = gende.female;
    black = hair.black;
    blond = hair.blond;
    chestnut = hair.chestnut;
    brown = hair.brown;
    let addressUser: Array<any> = [];
    map(swapis.users, (e) => {
      addressUser.push({[`${e.firstName}${e.lastName}`] : e.address.postalCode});
    });
   
    const userData: RootObject =
    {
      "male": male,                      // ---> Male Count Summary
      "female": female,                    // ---> Female Count Summary
      "ageRange": `${first(rangeAge)}-${last(rangeAge)}`,            // ---> Range
      "hair": {                       // ---> "Color": Color Summary
        "Black": black,
        "Blond": blond,
        "Chestnut": chestnut,
        "Brown": brown
      },
      "addressUser": addressUser
    };
    setUserData(userData);
    setTasksArray(data);

  }, [swapis])

  useEffect(() => {
    if (storeCount) {
      const intervalId = setInterval(() => {
        let newState = [];

        const seconds = Math.floor(new Date().getTime() / 1000);
        map(tasksArray, (e) => {

          if (e.isShow == false) {
            const timeShow = Math.floor(seconds - e.time);

            if (timeShow >= 5) {
              if (e.type === "Fruit") {
                const datareset = handleRemove(e, e.type);
                newState.push(datareset);
              } else if (e.type === "Vegetable") {
                const datareset = handleRemove(e, e.type);
                newState.push(datareset);
              }
            } else {
              newState.push({ ...e });;
            }
          } else {
            newState.push({ ...e });;
          }
        })
        setTasksArray(newState);

      }, 1000)
      return () => clearInterval(intervalId); //This is important
    }
  }, [tasksArray])

  const genderCount = (obj: any) => {
    return reduce(obj, (acc, curVal) => {
      if (curVal.gender === 'male') {
        acc.male++;
      }
      else {
        acc.female++;
      }
      return acc;
    }, { male: 0, female: 0 });
  }

  const hairCount = (obj: any) => {
    return reduce(obj, (acc, curVal) => {
      const color = curVal.hair.color;
      if (color === 'Black') {
        acc.black++;
      }
      else if (color === 'Blond') {
        acc.blond++;
      }
      else if (color === 'Chestnut') {
        acc.chestnut++;
      }
      else if (color === 'Brown') {
        acc.brown++;
      }
      return acc;
    }, { black: 0, blond: 0, chestnut: 0, brown: 0 });
  }

  const handleClickRemove = (data: Datareset, type: string) => {
    let newState = [];
    map(tasksArray, (e) => {

      if (e.name === data.name) {
        const datareset = handleRemove(e, e.type);
        newState.push(datareset);

      } else {
        newState.push({ ...e });
      }
    });
    setTasksArray(newState!);
  }

  const handleRemove = (data: Datareset, type: string) => {


    if (type === "Fruit") {
      setTasksFruit(tasksFruit => {
        return tasksFruit.filter((value, i) => value.name !== data.name)
      })
      return { ...data, fruit: false, isShow: true, time: '' }

    } else if (type === "Vegetable") {
      setTasksVegetable(tasksVegetable => {
        return tasksVegetable.filter((value, i) => value.name !== data.name)
      })
      return { ...data, vegetable: false, isShow: true, time: '' }
    }
  }

  const handleClick = (data) => {
    setStoreCount(true);
    let newState: ((prevState: DataTasks | undefined) => DataTasks | undefined) | List<any> | null | undefined = [];
    var seconds = Math.floor(new Date().getTime() / 1000);

    if (data.type === 'Fruit') {
      newState = tasksArray.map(obj =>
        obj.name === data.name ? { ...obj, fruit: true, isShow: false, time: seconds } : obj
      );
    } else if (data.type === 'Vegetable') {
      newState = tasksArray.map(obj =>
        obj.name === data.name ? { ...obj, vegetable: true, isShow: false, time: seconds } : obj
      );
    }
    const fruitData = filter(newState, 'fruit');
    const VegetableData = filter(newState, 'vegetable');


    setTasksArray(newState);
    setTasksFruit(fruitData);
    setTasksVegetable(VegetableData);
  }



  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        Welcome to <a href="https://nextjs.org">Next.js!</a>
      </h1>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CardContent>
            <Typography variant="h5" component="div">All</Typography>
            <Divider />
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              {
                map(tasksArray, (e, i) => {
                  if (e.isShow)
                    return <ListItemButton key={`tasksArray, ${i}`}> <ListItemText primary={e.name} onClick={() => handleClick(e)} /> </ListItemButton>;
                })

              }
            </List>
          </CardContent>
        </Grid>
        <Grid item xs={4}>
          <CardContent >

            <Typography variant="h5" component="div">Fruit</Typography>
            <Divider />

            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              {
                map(tasksFruit, (e, i) => {
                  return <ListItemButton key={`tasksFruit, ${i}`}> <ListItemText primary={e.name} onClick={() => handleClickRemove(e, e.type)} /> </ListItemButton>;
                })

              }
            </List>
          </CardContent>
        </Grid>
        <Grid item xs={4}>
          <CardContent>
            <Typography variant="h5" component="div">Vegetable</Typography>
            <Divider />

            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              {
                map(tasksVegetable, (e, i) => {
                  return <ListItemButton key={`tasksVegetable, ${i}`}> <ListItemText primary={e.name} onClick={() => handleClickRemove(e, e.type)} /> </ListItemButton>;
                })

              }
            </List>
          </CardContent>
        </Grid>
      </Grid>

      {JSON.stringify(userData)}
    </main>
  );
}

export default Home