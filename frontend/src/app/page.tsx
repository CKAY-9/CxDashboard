import { getUserData } from "@/api/user";
import Header from "@/components/header/header";
import style from "./home.module.scss";
import Footer from "@/components/footer/footer";
import Image from "next/image";

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
					<div className={style.info}>
						<h1>Real-time Statistics</h1>
						<p>CxDashboard provides real-time statistics for all of your game servers. These allow you to see what is happening in your server any place, any time!</p>
					</div>
					<div className={style.showcase}>
						<Image src="/index/Statistics.png" alt="Dashboard" sizes="100%" width={0} height={0}></Image>
					</div>
				</section>
				<div className="seperator"></div>
				<section className={style.feature}>
					<div className={style.showcase}>
						<Image src="/index/Interaction.png" alt="Dashboard" sizes="100%" width={0} height={0}></Image>
					</div>
					<div className={style.info}>
						<h1>Interact with your Server</h1>
						<p>Notice players going a bit wild? You can easily manage them with CxDashboard&apos;s panel to server interactions. </p>
					</div>
				</section>
				<div className="seperator"></div>
				<section className={style.feature}>
					<div className={style.info}>
						<h1>Easy-to-use Dashboard</h1>
						<p>CxDashboard&apos;s dashboard is made to be easy-to-use and accessible for everyone.</p>
					</div>
					<div className={style.showcase}>
						<Image src="/index/Dashboard.png" alt="Dashboard" sizes="100%" width={0} height={0}></Image>
					</div>
				</section>
			</main>

			<Footer></Footer>
		</>
	);
}

export default Home;