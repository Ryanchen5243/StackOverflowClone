import { useContext } from 'react';
import AppStateContext from '../context/AppStateContext';

export default function Mainsection() {
  const { pageComponent } = useContext(AppStateContext);
  return (
    <section id = "mainsection">
      { pageComponent }
    </section>
  );
} 