import { getUserData } from "@/api/user";
import Header from "@/components/header/header";
import style from "./home.module.scss";

const Home = async () => {
	const data = await getUserData();

	return (
		<>
			<Header userData={data}></Header>
			<div className={style.landing}>
				<video className={style.video} src="/CxDashboardLanding.mp4" loop autoPlay muted></video>
				<div className={style.cover}>
					<h1>CxDashboard</h1>
					<h2>Manage your game server with ease and simplicity</h2>
				</div>
			</div>
			<main className="container" style={{"margin": "100vh 15rem 5rem"}}>
				<section className={style.feature}>
					<h1>Real-time Statistics</h1>
					<p>CxDashboard provides real-time statistics for all of your game servers. These allow you to see what is happening in your server any place, any time!</p>
				</section>
				<div className="seperator"></div>
				<section className={style.feature}>
					<h1>Interact with your Server</h1>
					<p>Notice players going a bit wild? You can easily manage them with CxDashboard's panel to server interactions. </p>
				</section>
				<div className="seperator"></div>
				<section className={style.feature}>
					<h1>Easy-to-use Dashboard</h1>
					<p>CxDashboard's dashboard is made to be easy-to-use and accessible for everyone.</p>
				</section>
			</main>
		</>
	);
}

export default Home;