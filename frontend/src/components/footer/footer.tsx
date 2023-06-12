import Link from "next/link";

const Footer = () => {
    return (
        <footer>
            <nav>
                <section>
                    <strong>Navigation</strong>
                    <Link href="/">Home</Link>
                    <Link href="/login">Login</Link>
                    <Link href="https://github.com/Camerxxn/CxDashboard" target="_blank">Github</Link>
                </section>
                <section>
                    <strong>Dashboard</strong>
                    <Link href="/dashboard">Dashboard</Link>
                    <Link href="/link">Link</Link>
                </section>
            </nav>
            <span>
                Made with ❤️ by <Link href="https://github.com/Camerxxn" target="_blank">Camerxxn</Link>
            </span>
        </footer>
    );
}

export default Footer;
