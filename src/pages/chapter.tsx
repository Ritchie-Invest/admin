import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getChapterById } from '@/services/chapter.service';
import { getLessonsByChapter } from '@/services/lesson.service';
import { LessonCreateDialog } from '@/components/lesson-create-dialog';

export function ChapterPage() {

  const { chapterId } = useParams();

  const chapterQuery = useQuery({
    queryKey: ['chapter', chapterId],
    queryFn: () => getChapterById(chapterId!),
    enabled: !!chapterId,
  });

  const lessonsQuery = useQuery({
    queryKey: ['lessons', chapterId],
    queryFn: () => getLessonsByChapter(chapterId!),
    enabled: !!chapterId,
  });

  if (chapterQuery.isLoading || lessonsQuery.isLoading) return <div>Chargement...</div>;
  if (chapterQuery.error || lessonsQuery.error)
    return <div className="text-red-600">Erreur lors du chargement</div>;
  const chapter = chapterQuery.data;
  const lessons = lessonsQuery.data || [];

  if (!chapter) {
    return <div className="text-red-600">Chapitre introuvable</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <Link to="/" className="inline-block text-sm text-black bg-gray-100 hover:bg-gray-200 rounded px-3 py-1 mb-2 transition-colors">
          ← Retour
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-2">{chapter.title}</h1>
      <p className="mb-6 text-gray-600">{chapter.description}</p>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Leçons</h2>
        <LessonCreateDialog chapterId={chapterId!} />
      </div>
      <ul className="space-y-2 mb-6">
        {lessons.length === 0 && <li className="text-gray-500">Aucune leçon</li>}
        {lessons.map((lesson: any) => (
          <li key={lesson.id} className="border p-4 rounded">
            <div className="font-semibold">{lesson.title}</div>
            <div className="text-sm text-gray-600">{lesson.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
