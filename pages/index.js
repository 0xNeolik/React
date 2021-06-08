import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import { Fragment } from "react";

//Este componente sirve para agregar texto en las busquedas de Google
import Head from "next/head";

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>On the User</title>
        <meta
          name="description"
          content="The best UX/UI page of the fucking Andorra"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

//la siguiente funcion solo funciona en la carpeta Pages
export async function getStaticProps() {
  //fetch data from an API
  const client = await MongoClient.connect(
    "mongodb+srv://Admin:JQ0N9j97KDtS9UR0@cluster0.w8uxb.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  console.log("Conexion");
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
        description: meetup.description,
      })),
    },
    //esta opcion sigueinte lo que hace es regenerar la pagina cada tiempo que le marcamos en segundos
    // es decir poniendo un 10 refrescara la pagina cada 10 segundos
    //si fuese un 3600 seria cada hora
    revalidate: 1,
  };
}

export default HomePage;
