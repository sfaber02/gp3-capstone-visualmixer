import React from 'react'

export const Time = ({time, id}) => {
  return (
      <div id={id}>
          {/*PRETTIER keeps multilining the first .toFixed()! */}
          {/* prettier-ignore */}
          <p>{`${Math.floor(time.current / 60)}:${(time.current % 60).toFixed(0) < 10 ? 
                                `0${(time.current % 60).toFixed(0)}`: 
                                (time.current % 60).toFixed(0)}`} / 
                            {`${Math.floor(time.duration / 60)}:
                            ${(time.duration % 60).toFixed(0) < 10 ? 
                                `0${(time.duration % 60).toFixed(0)}`: 
                                (time.duration % 60).toFixed(0)}`}
                            </p>
      </div>
  );
}
