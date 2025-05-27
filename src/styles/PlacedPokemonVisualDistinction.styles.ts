import styled from "@emotion/styled";

// 配置済みポケモンの視覚的区別用CSS
// グローバルCSSスタイルとして適用される
export const PlacedPokemonStyles = styled.div`
  .is-placed-in-tier {
    filter: grayscale(100%);
    opacity: 0.6;
    transition: filter 0.3s ease, opacity 0.3s ease;
  }

  .is-placed-in-tier:hover {
    filter: grayscale(50%);
    opacity: 0.8;
  }
`;