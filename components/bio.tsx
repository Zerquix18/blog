import { AUTHOR_NAME } from '../constants';

export default function Bio() {
  return (
    <div className="bio">
      <p>
        Personal blog by{' '}
        <strong>{AUTHOR_NAME}</strong>. I write about web development, programming, and technology.
      </p>
    </div>
  );
}
