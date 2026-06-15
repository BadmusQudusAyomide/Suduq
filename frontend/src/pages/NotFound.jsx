import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function NotFound() {
  return (
    <Card className="mx-auto mt-10 max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Page not found</CardTitle>
        <CardDescription>
          The route you opened does not exist yet. Let’s head back to the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button asChild variant="default">
          <Link to="/">Back home</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
