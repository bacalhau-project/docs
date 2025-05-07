import React, {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type PartnerItem = {
    name: string;
    image: string | React.ComponentType<React.ComponentProps<'svg'>>;
};

const PartnerList: PartnerItem[] = [
    {
        name: 'Expanso',
        image: require('@site/static/img/partners/expanso.png').default,
    },
    {
        name: 'University of Maryland',
        image: require('@site/static/img/partners/maryland.png').default,
    },
    {
        name: 'Weather XM',
        image: require('@site/static/img/partners/weather.png').default,
    },
    {
        name: 'Prelinger Collection',
        image: require('@site/static/img/partners/prelinger.png').default,
    },
    {
        name: 'BOINC',
        image: require('@site/static/img/partners/boinc.png').default,
    },
    {
        name: 'City of Las Vegas',
        image: require('@site/static/img/partners/vegas.png').default,
    },
    {
        name: 'DeSci Foundation',
        image: require('@site/static/img/partners/desci.png').default,
    },
];

function Partner({name, image}: PartnerItem) {
    return (
        <div className={clsx('col')}>
            <div className="text--center padding-horiz--md">
                {typeof image === 'string' ? (
                    <img
                        src={image}
                        alt={name}
                        className={styles.partnerLogo}
                    />
                ) : (
                    // For SVG components
                    // Using the SVG component correctly
                    React.createElement(image, {
                        className: styles.partnerLogo,
                        role: "img",
                        "aria-label": name
                    })
                )}
            </div>
        </div>
    );
}

export function HomepagePartners(): ReactNode {
    return (
        <section className={styles.partners}>
            <div className="container">
                <Heading as="h3" className="text--center margin-bottom--lg">
                    Currently in use at:
                </Heading>
                <div className="row row--align-center">
                    {PartnerList.map((props, idx) => (
                        <Partner key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}