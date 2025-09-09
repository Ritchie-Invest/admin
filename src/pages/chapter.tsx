import { useParams, Link } from 'react-router-dom';
import { useChapter } from '@/services/chapter.service';
import { useLessonsByChapter } from '@/services/lesson.service';
import { LessonCreateDialog } from '@/components/lesson-create-dialog';
import type { Lesson } from '@/services/lesson.service';
import { GameModuleList } from '@/components/game-module-list';
import { GameModuleCreateDialog } from '@/components/game-module-create-dialog';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function ChapterPage() {
  const { chapterId } = useParams();
  const chapterQuery = useChapter(chapterId);
  const lessonsQuery = useLessonsByChapter(chapterId);

  if (chapterQuery.isLoading || lessonsQuery.isLoading) return <div>Chargement...</div>;
  if (chapterQuery.error || lessonsQuery.error)
    return <div className="text-red-600">Erreur lors du chargement</div>;

  const chapter = chapterQuery.data;
  const lessons = lessonsQuery.data || [];

  if (!chapter) {
    return <div className="text-red-600">Chapitre introuvable</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <Link to="/" className="inline-block text-sm text-black bg-gray-100 hover:bg-gray-200 rounded px-3 py-1 transition-colors">
          ← Retour
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold">{chapter.title}</h1>
        <p className="text-gray-600">{chapter.description}</p>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Leçons</h2>
        <LessonCreateDialog chapterId={chapterId!} />
      </div>
      <div className="space-y-4">
        {lessons.length === 0 && (
          <div className="text-gray-500">Aucune leçon</div>
        )}
        {lessons.map((lesson: Lesson) => (
          <Card key={lesson.id}>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">{lesson.title}</CardTitle>
              <CardDescription>{lesson.description}</CardDescription>
              <CardAction>
                <GameModuleCreateDialog lessonId={lesson.id} />
              </CardAction>
            </CardHeader>
            <CardContent className="py-4">
              <div className="text-sm font-medium mb-2">Modules</div>
              <GameModuleList lessonId={lesson.id} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
