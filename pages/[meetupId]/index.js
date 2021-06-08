import MeetupDetails from "../../components/meetups/MeetupDetails";
import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";
import Head from "next/head";

function MeetupDetail(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetails
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://Admin:JQ0N9j97KDtS9UR0@cluster0.w8uxb.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  console.log("Conexion");
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  //fetch data for a single meetup
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://Admin:JQ0N9j97KDtS9UR0@cluster0.w8uxb.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectMeetup._id.toString(),
        title: selectMeetup.title,
        image: selectMeetup.image,
        description: selectMeetup.description,
        address: selectMeetup.address,
      },
    },
  };
}

export default MeetupDetail;
