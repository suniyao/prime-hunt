import { TypeAnimation } from "react-type-animation"

export default function Start() {
  return (
    <div>
      <h1>Prime Hunt</h1>
      <div>
        <TypeAnimation
          sequence={[
            // Same substring at the start will only be typed once, initially
            'word hunt for nerds',
            1000,
            'We produce food for Hamsters',
            1000,
            'We produce food for Guinea Pigs',
            1000,
            'We produce food for Chinchillas',
            1000,
          ]}
          speed={50}
          style={{ fontSize: '2em' }}
          repeat={Infinity}
        />
      </div>
    </div>
  )
}