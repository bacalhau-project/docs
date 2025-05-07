import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
    title: string;
    Svg: React.ComponentType<React.ComponentProps<'svg'>>;
    description: ReactNode;
};

const FeatureList: FeatureItem[] = [
    {
        title: 'Designed to be fast.',
        Svg: require('@site/static/img/lightning.svg').default,
        description: (
            <>
                Bacalhau is designed to make building, orchestrating, and executing distributed workloads easy. Because it supports Docker
                and WASM, jobs can be onboarded and run without complex configuration and almost no changes to your code base.
            </>
        ),
    },
    {
        title: 'Built to be efficient.',
        Svg: require('@site/static/img/tick.svg').default,
        description: (
            <>
                Bacalhau can run on nearly any architecture, from the largest VMs and GPUs to low power edge and IoT devices. Furthermore,
                Bacalhau helps make data processing cost effective by utilizing idle compute capacity, and allows for the processing and
                reduction of large files and datasets before transport.
            </>
        ),
    },
    {
        title: 'Improved Security/Governance',
        Svg: require('@site/static/img/home.svg').default,
        description: (
            <>
                Bacalhau allows you to respect geographic and privacy boundaries - scheduling jobs and moving only the data you audit and
                allow. It includes features and tools to ensure sensitive data never need to be moved away from secure storage environments.
            </>
        ),
    },
];

function Feature({title, Svg, description}: FeatureItem) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--left padding-horiz--md">
                <Svg className={styles.featureSvg} role="img"/>
            </div>
            <div className="text--left padding-horiz--md">
                <Heading as="h3">{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): ReactNode {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}