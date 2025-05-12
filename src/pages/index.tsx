import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import BannerLogo from '@site/static/img/logos/square-black.svg';

import styles from './index.module.css';
import {HomepagePartners} from "@site/src/components/HomepagePartners";

function HomepageHeader() {
    return (
        <header className={clsx('hero', styles.heroBanner)}>
            <div className={styles.heroBackground}>
                <BannerLogo className={styles.heroLogo} aria-hidden="true" />
            </div>
            <div className="container">
                <div className={styles.heroFlex}>
                    <div className={styles.heroContent}>
                        <Heading as="h1" className={styles.heroTitle}>
                            Distributed
                            <br/>
                            Compute Over Data
                        </Heading>
                        <p>
                            Bacalhau is a platform for fast, cost efficient, and secure computation
                            that enables users to run compute jobs where the data is
                            generated
                            and stored.
                        </p>
                        <p>
                            With the open-source software Bacalhau, you can streamline your
                            existing workflows without rewriting by running Docker containers
                            and WebAssembly (WASM) images as tasks. This architecture is
                            also referred to as Compute Over Data (or CoD).
                        </p>
                        <div>
                            <p>
                                The name <Link href="https://en.wikipedia.org/wiki/Bacalhau">Bacalhau</Link> comes from the Portuguese word
                                for cod.
                            </p>
                            <div className={styles.buttons}>
                                <Link
                                    className={styles.ctaButton}
                                    to="/docs/getting-started/quick-start">
                                    Get Started
                                </Link>
                                <Link
                                    className={styles.secondaryButton}
                                    href="https://bacalhauproject.slack.com/">
                                    Join US on Slack
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default function Home(): ReactNode {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout
            title={`${siteConfig.title}`}
            description="Bacalhau is a platform for fast, cost efficient, and secure computation that enables users to run compute jobs where the data is generated and stored.">
            <HomepageHeader/>
            <main>
                <HomepageFeatures />
                <HomepagePartners />
            </main>
        </Layout>
    );
}