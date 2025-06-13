import { renderView } from "./renderers/renderView";
import type { ViewSchema } from "./renderers/types";
import views from "./views.json";

(views as ViewSchema[]).forEach((view, index) => {
  console.log(`\n[View ${index + 1}]`);
  console.log(renderView(view));
});
