import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Fast',
    Png: require('../../static/img/cpp_logo.png').default,
    description: (
      <>
       Made for long molecular dynamics trajectories. 
      </>
    ),
  },
  {
    title: 'Maximum control',
    Png: require('../../static/img/1hvr_apo_ch.png').default,
    description: (
      <>
        Define your cavity both manually and easily by listing the lining residues.
        No need to pinpoint the exact coordinates of its location.
      </>
    ),
  },
  {
    title: 'Adaptive cavity definition',
    Png: require('../../static/img/adaptive.png').default,
    description: (
      <>
        Follow cavity changes along large conformational changes.
        ANA will automatically track the cavity residues and adapt its definition.
      </>
    ),
  },
  {
    title: 'Cavity flexibility',
    Png: require('../../static/img/abstract_fig_cut.png').default,
    description: (
      <>
        Predict flexibility using a set of collective coordinates as Normal Modes or Principal Components.
      </>
    ),
  },
];

function FeaturePNG({Png, title, description}) {
  return (
    <div className={clsx('col col--3')}>
      <div className="text--center">
        <img src={Png} className={styles.featurePng} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}
function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--3')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <FeaturePNG key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
