
import styled from 'styled-components';

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const BannerSection = styled.section`
  background: linear-gradient(to bottom right, ${props => props.theme.primary}, ${props => props.theme.secondary});
  color: ${props => props.theme.light};
  padding: 4rem 0;
  text-align: center;

  .title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
  }

  .cta-form .input,
  .cta-form .button {
    border-radius: 50px;
    height: 3rem;
  }

  .cta-form .button {
    background-color: #ffffff77;
    color: ${props => props.theme.primary};
    font-weight: bold;
  }
`;

export const FeaturesSection = styled.section`
  background-color: #f4f4f9;
  padding: 4rem 0;

  .columns {
    margin-bottom: 3rem;
  }

  .column.is-7 {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .title {
    font-size: 1.75rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.primary};
  }

  .image img {
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const CasesSection = styled.section`
  background-color: #ffffff;
  padding: 4rem 0;

  .title {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
    color: ${props => props.theme.dark};
  }

  .columns {
    margin-bottom: 3rem;
  }

  .column.is-7 {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .title.is-3 {
    margin-top: auto;
    border: ${props => props.theme.primary} solid 1px;
    flex-direction: column;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.primary};
  }
`;

export const CTASection = styled.section`
  background-color: ${props => props.theme.dark};
  color: ${props => props.theme.light};
  padding: 4rem 0;
  text-align: center;

  .title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
  }

  .cta-form .input,
  .cta-form .button {
    border-radius: 50px;
    height: 3rem;
  }

  .cta-form .button {
    background-color: #ffffffb6;
    color: ${props => props.theme.primary};
    font-weight: bold;
  }
`;

export const Footer = styled.footer`
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.light};
  padding: 2rem 0;
  text-align: center;

  .footer-nav a {
    color: ${props => props.theme.light};
    margin: 0 1rem;
    text-decoration: none;
  }

  .footer-nav a:hover {
    text-decoration: underline;
  }

  .footer-logo {
    max-width: 100px;
    margin-bottom: 1rem;
  }
`;
