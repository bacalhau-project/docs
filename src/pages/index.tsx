import type {ReactNode} from 'react';
import {useEffect} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import lottie from 'lottie-web';

import styles from './index.module.css';
import {HomepagePartners} from "@site/src/components/HomepagePartners";

function HomepageHeader() {
    useEffect(() => {
        const loadLottie = async () => {
            try {
                const animationContainer = document.getElementById('bacalhau-lottie');
                if (animationContainer) {
                    const response = await fetch('/bacalhau.json');
                    const animationData = await response.json();

                    lottie.loadAnimation({
                        container: animationContainer,
                        renderer: 'svg',
                        loop: true,
                        autoplay: true,
                        animationData: animationData,
                    });
                }
            } catch (error) {
                console.error('Failed to load Lottie animation:', error);
            }
        };

        loadLottie();
    }, []);

    return (
        <section className={styles.heroSection}>
            <div className={styles.backgroundLeft}>
                <img src="/img/BgOverlayLeft.svg" alt="background overlay left" />
            </div>
            <div className={styles.backgroundRight}>
                <img src="/img/BgOverlayRight.svg" alt="background overlay right" />
            </div>
            <div className={styles.container}>
                <div className={styles.computation}>
                    <div className={styles.computationItem}>
                        <Heading as="h1" className={styles.heroTitle}>
                            Distributed Compute Over Data
                        </Heading>
                        <p className={styles.subText}>
                            Bacalhau is a platform for fast, cost efficient, and secure computation that enables users to run compute jobs <em>where</em> the data is generated and stored.
                            <br/><br/>
                            With the open-source software Bacalhau, you can streamline your existing workflows without rewriting by running Docker containers and WebAssembly (WASM) images as tasks. This architecture is also referred to as <strong>Compute Over Data</strong> (or CoD).
                            <br/><br/>
                            <em>The name </em><Link href="https://en.wikipedia.org/wiki/Bacalhau"><em>&quot;Bacalhau&quot;</em></Link><em> comes from the Portuguese word for cod.</em>
                        </p>
                        <div className={styles.githubButton}>
                            <iframe
                                src="https://ghbtns.com/github-btn.html?user=bacalhau-project&repo=bacalhau&type=star&count=true&size=large"
                                width="170"
                                height="30"
                                title="GitHub"
                            />
                        </div>
                    </div>
                    <div className={styles.computationItem}>
                        <div
                            className={styles.lottieAnimation}
                            id="bacalhau-lottie"
                        />
                    </div>
                </div>
                <div className={styles.ctaSection}>
                    <div className={styles.ctaText}>Become part of our community</div>
                    <Link className={styles.ctaButton} href="https://bac.al/slack">
                        <strong>JOIN US ON SLACK</strong>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default function Home(): ReactNode {
    const {siteConfig} = useDocusaurusContext();

    // Force dark mode for this page
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
    }, []);

    return (
        <Layout
          title="Distributed Compute Over Data"
            description="Bacalhau is a platform for fast, cost efficient, and secure computation that enables users to run compute jobs where the data is generated and stored.">
            <HomepageHeader/>
            <main>
                <HomepageFeatures />
                <HomepagePartners />
            </main>
        </Layout>
    );
}