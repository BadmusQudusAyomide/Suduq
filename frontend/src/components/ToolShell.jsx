import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export default function ToolShell({
  categoryLabel,
  title,
  description,
  leftTitle,
  leftDescription,
  rightTitle,
  rightDescription,
  leftAction,
  rightAction,
  rightHeaderAction,
  leftChildren,
  rightChildren,
  rightClassName = ''
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <CardHeader>
          {categoryLabel ? <Badge className="w-fit">{categoryLabel}</Badge> : null}
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {leftAction ? <div>{leftAction}</div> : null}
          {leftTitle || leftDescription ? (
            <div className="space-y-1">
              {leftTitle ? <h3 className="text-sm font-medium">{leftTitle}</h3> : null}
              {leftDescription ? <p className="text-sm text-muted-foreground">{leftDescription}</p> : null}
            </div>
          ) : null}
          {leftChildren}
        </CardContent>
      </Card>

      <Card className={rightClassName}>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">{rightTitle}</CardTitle>
              <CardDescription>{rightDescription}</CardDescription>
            </div>
            {rightHeaderAction ? <div>{rightHeaderAction}</div> : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {rightAction ? <div>{rightAction}</div> : null}
          {rightChildren}
        </CardContent>
      </Card>
    </section>
  );
}
