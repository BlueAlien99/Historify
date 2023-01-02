import { useState } from 'react';

interface Props {
    src: string;
}

function Audio({ src }: Props) {
    const [shouldPlay, setShouldPlay] = useState(false);

    return (
        <div className="audio">
            {shouldPlay ? (
                <>
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <video src={src} autoPlay />
                    <button type="button" onClick={() => setShouldPlay(false)}>
                        ⬛
                    </button>
                </>
            ) : (
                <button type="button" onClick={() => setShouldPlay(true)}>
                    ▶️
                </button>
            )}
        </div>
    );
}

export default Audio;
