function RecipeCard(props) {
  return (
    <div className="RecipeCard card">
      {!props.recipe.image ? (
        <img
          src="https://static.vecteezy.com/system/resources/previews/008/695/917/original/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg"
          alt="no image"
        />
      ) : (
        <img src={props.recipe.image} alt={props.recipe.name} />
      )}
      <h3>{props.recipe.name}</h3>
    </div>
  );
}
export default RecipeCard;
