import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import style from '../styles/waveGenerator.module.css';
import { HexAlphaColorPicker } from 'react-colorful';

const Home: NextPage = () => {
  const msg = useRef<HTMLDivElement>(null);
  const colorPicker = useRef<HTMLDivElement>(null);

  const [wave, setWave] = useState({
    width: 500, //px
    height: 200, //px
    offset: 50,
    amplitude: 30,
    frequency: 1,
    rotate: 180, //deg
    color: '#2386be',
  });

  const [clipPathCss, setClipPathCss] = useState({
    'clip-path': 'polygon(100% 0%, 0% 0%)',
    'background-color': wave.color,
    width: wave.width,
    height: wave.height,
    transform: `rotate(${wave.rotate}deg)`,
  });

  useEffect(() => {
    const units = (wave.frequency * wave.width) / 100;
    let polygonData = '100% 0%, 0% 0%';
    for (let i = 0; i <= 100; i++) {
      let val = wave.offset + wave.amplitude * Math.cos(i / units);
      val = Number(((val / wave.height) * 100).toFixed(2));
      polygonData += `, ${i}% ${val}%`;
      setClipPathCss({
        'clip-path': `polygon(${polygonData})`,
        width: wave.width,
        height: wave.height,
        transform: `rotate(${wave.rotate}deg)`,
        'background-color': wave.color,
      });
    }
  }, [wave.amplitude, wave.color, wave.frequency, wave.height, wave.offset, wave.rotate, wave.width]);

  const resualt = () => {
    return `{
      width: ${wave.width};
      height: ${wave.height};
      clip-path:${clipPathCss['clip-path']};
      background-color: ${wave.color};
      transform: rotate(${wave.rotate}deg);
    }`;
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="A tool that generate wave CSS clip path for a container" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className={style.container}>
          <div className={style.waveInputs}>
            <h1>Wave Generator</h1>
            <div>
              <label>Width: </label>
              <input
                type="number"
                id="width"
                value={wave.width}
                onChange={e => {
                  setWave(prev => {
                    return { ...prev, width: Number(e.target.value) };
                  });
                }}
              />
            </div>
            <div>
              <label>Height: </label>
              <input
                type="number"
                id="height"
                value={wave.height}
                onChange={e => {
                  setWave(prev => {
                    return { ...prev, height: Number(e.target.value) };
                  });
                }}
              />
            </div>
            <div>
              <label>Offset: </label>
              <input
                type="number"
                id="offset"
                value={wave.offset}
                onChange={e => {
                  setWave(prev => {
                    return { ...prev, offset: Number(e.target.value) };
                  });
                }}
              />
            </div>
            <div>
              <label>Amplitude: </label>
              <input
                type="number"
                id="amplitude"
                value={wave.amplitude}
                onChange={e => {
                  setWave(prev => {
                    return { ...prev, amplitude: Number(e.target.value) };
                  });
                }}
              />
            </div>
            <div>
              <label>Frequency: </label>
              <input
                type="number"
                id="frequency"
                value={wave.frequency}
                onChange={e => {
                  setWave(prev => {
                    return { ...prev, frequency: Number(e.target.value) };
                  });
                }}
              />
            </div>
            <div>
              <label>Rotate: </label>
              <input
                type="number"
                id="rotate"
                value={wave.rotate}
                onChange={e => {
                  setWave(prev => {
                    return { ...prev, rotate: Number(e.target.value) };
                  });
                }}
              />
            </div>
            <div>
              <label>Color: </label>

              <button
                onClick={() => {
                  if (colorPicker.current && colorPicker.current.style.display === 'flex') {
                    colorPicker.current.style.display = 'none';
                  } else if (colorPicker.current) {
                    colorPicker.current.style.display = 'flex';
                  }
                }}
                className={style.color}
                style={{ background: wave.color }}></button>
              <div ref={colorPicker} style={{ display: 'none' }}>
                <HexAlphaColorPicker
                  id="color"
                  color={wave.color}
                  onChange={e => {
                    setWave(prev => {
                      return { ...prev, color: e };
                    });
                  }}
                />
              </div>
            </div>
            <div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(resualt());
                  if (msg.current) {
                    msg.current.style.visibility = 'visible';
                    msg.current.style.opacity = '1';
                  }

                  setTimeout(() => {
                    if (msg.current) {
                      msg.current.style.visibility = 'hidden';
                      msg.current.style.opacity = '0';
                    }
                  }, 1000);
                }}>
                Copy to clipboard
              </button>
            </div>

            <div ref={msg} className={style.msg}>
              Copied to clipboard!
            </div>
          </div>
          <div className={style.result}>{resualt()}</div>
        </div>
        <div
          style={{
            width: clipPathCss.width,
            height: clipPathCss.height,
            background: clipPathCss['background-color'],
            transform: clipPathCss.transform,
            clipPath: clipPathCss['clip-path'],
          }}
          className={style.waveContainer}></div>

        <Link href={'https://github.com/sadiloo/Wave-Generator'} target={'_blank'}>
          <div className="github">
            <FaGithub />
          </div>
        </Link>
      </main>
    </>
  );
};

export default Home;
