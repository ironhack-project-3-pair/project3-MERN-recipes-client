import { Container } from 'react-bootstrap';

const AboutPage = () => {
  return (
    <div className="AboutPage">
      <Container>
        <h1 className="m-3">About</h1>

        <p>
          <h4>Tit-tit is a meal planing app, developed by <a href="https://github.com/hymced">Cédric ROCHER</a> and <a href="https://github.com/linhvnde">Linh NGUYEN HOANG</a> </h4>
          We created this app to wish for our people to stay healthy with delicious recipes. The <span>Tit-tit Kitchen</span> is named after a combination of French word Bon-appetit and Vietnamese way of saying Bon-appetit it a sweet and short. Just like our app, we want to keep it sweet and short.
          <br />
          <ul>
            <li>A user can create public ingredients and public recipes</li>
            <li>Then the user can manage its own ingredients stored in his/her kitchen based on what he/she really has at home</li>
            <li>The user can plan its meals for the week</li>
            <li>The user can consume its ingredients on a daily basis</li>
          </ul>
        </p>
                
      </Container>
    </div>
  );
};

export default AboutPage;
