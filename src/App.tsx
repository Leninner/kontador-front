'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/components/ui/kibo-ui/kanban';
import type { DragEndEvent } from '@/components/ui/kibo-ui/kanban';
import { useState } from 'react';
import {
  addMonths,
  endOfMonth,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns';
const today = new Date();

const exampleStatuses = [
  { id: '1', name: 'Planned', color: '#6B7280' },
  { id: '2', name: 'In Progress', color: '#F59E0B' },
  { id: '3', name: 'Done', color: '#10B981' },
];

const exampleFeatures = [
  {
    id: '1',
    name: 'AI Scene Analysis',
    startAt: startOfMonth(subMonths(today, 6)),
    endAt: subDays(endOfMonth(today), 5),
    status: exampleStatuses[0],
    group: { id: '1', name: 'Core AI Features' },
    product: { id: '1', name: 'Video Editor Pro' },
    owner: {
      id: '1',
      image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=1',
      name: 'Alice Johnson',
    },
    initiative: { id: '1', name: 'AI Integration' },
    release: { id: '1', name: 'v1.0' },
  },
  {
    id: '2',
    name: 'Collaborative Editing',
    startAt: startOfMonth(subMonths(today, 5)),
    endAt: subDays(endOfMonth(today), 5),
    status: exampleStatuses[1],
    group: { id: '2', name: 'Collaboration Tools' },
    product: { id: '1', name: 'Video Editor Pro' },
    owner: {
      id: '2',
      image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=2',
      name: 'Bob Smith',
    },
    initiative: { id: '2', name: 'Real-time Collaboration' },
    release: { id: '1', name: 'v1.0' },
  },
  {
    id: '3',
    name: 'AI-Powered Color Grading',
    startAt: startOfMonth(subMonths(today, 4)),
    endAt: subDays(endOfMonth(today), 5),
    status: exampleStatuses[2],
    group: { id: '1', name: 'Core AI Features' },
    product: { id: '1', name: 'Video Editor Pro' },
    owner: {
      id: '3',
      image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=3',
      name: 'Charlie Brown',
    },
    initiative: { id: '1', name: 'AI Integration' },
    release: { id: '2', name: 'v1.1' },
  },
  {
    id: '4',
    name: 'Real-time Video Chat',
    startAt: startOfMonth(subMonths(today, 3)),
    endAt: subDays(endOfMonth(today), 12),
    status: exampleStatuses[0],
    group: { id: '2', name: 'Collaboration Tools' },
    product: { id: '1', name: 'Video Editor Pro' },
    owner: {
      id: '4',
      image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=4',
      name: 'Diana Prince',
    },
    initiative: { id: '2', name: 'Real-time Collaboration' },
    release: { id: '2', name: 'v1.1' },
  },
  {
    id: '5',
    name: 'AI Voice-to-Text Subtitles',
    startAt: startOfMonth(subMonths(today, 2)),
    endAt: subDays(endOfMonth(today), 5),
    status: exampleStatuses[1],
    group: { id: '1', name: 'Core AI Features' },
    product: { id: '1', name: 'Video Editor Pro' },
    owner: {
      id: '5',
      image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=5',
      name: 'Ethan Hunt',
    },
    initiative: { id: '1', name: 'AI Integration' },
    release: { id: '2', name: 'v1.1' },
  },
  {
    id: '6',
    name: 'Cloud Asset Management',
    startAt: startOfMonth(subMonths(today, 1)),
    endAt: endOfMonth(today),
    status: exampleStatuses[2],
    group: { id: '3', name: 'Cloud Infrastructure' },
    product: { id: '1', name: 'Video Editor Pro' },
    owner: {
      id: '6',
      image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=6',
      name: 'Fiona Gallagher',
    },
    initiative: { id: '3', name: 'Cloud Migration' },
    release: { id: '3', name: 'v1.2' },
  },
  {
    id: '7',
    name: 'AI-Assisted Video Transitions',
    startAt: startOfMonth(today),
    endAt: endOfMonth(addMonths(today, 1)),
    status: exampleStatuses[0],
    group: { id: '1', name: 'Core AI Features' },
    product: { id: '1', name: 'Video Editor Pro' },
    owner: {
      id: '7',
      image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=7',
      name: 'George Lucas',
    },
    initiative: { id: '1', name: 'AI Integration' },
    release: { id: '3', name: 'v1.2' },
  },
  {
    id: '8',
    name: 'Version Control System',
    startAt: startOfMonth(addMonths(today, 1)),
    endAt: endOfMonth(addMonths(today, 2)),
    status: exampleStatuses[1],
    group: { id: '2', name: 'Collaboration Tools' },
    product: { id: '1', name: 'Video Editor Pro' },
    owner: {
      id: '8',
      image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=8',
      name: 'Hannah Montana',
    },
    initiative: { id: '2', name: 'Real-time Collaboration' },
    release: { id: '3', name: 'v1.2' },
  },
  {
    id: '9',
    name: 'AI Content-Aware Fill',
    startAt: startOfMonth(addMonths(today, 2)),
    endAt: endOfMonth(addMonths(today, 3)),
    status: exampleStatuses[2],
    group: { id: '1', name: 'Core AI Features' },
    product: { id: '1', name: 'Video Editor Pro' },
    owner: {
      id: '9',
      image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=9',
      name: 'Ian Malcolm',
    },
    initiative: { id: '1', name: 'AI Integration' },
    release: { id: '4', name: 'v1.3' },
  },
  {
    id: '10',
    name: 'Multi-User Permissions',
    startAt: startOfMonth(addMonths(today, 3)),
    endAt: endOfMonth(addMonths(today, 4)),
    status: exampleStatuses[0],
    group: { id: '2', name: 'Collaboration Tools' },
    product: { id: '1', name: 'Video Editor Pro' },
    owner: {
      id: '10',
      image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=10',
      name: 'Julia Roberts',
    },
    initiative: { id: '2', name: 'Real-time Collaboration' },
    release: { id: '4', name: 'v1.3' },
  },
  {
    id: '11',
    name: 'AI-Powered Audio Enhancement',
    startAt: startOfMonth(addMonths(today, 4)),
    endAt: endOfMonth(addMonths(today, 5)),
    status: exampleStatuses[1],
    group: { id: '1', name: 'Core AI Features' },
    product: { id: '1', name: 'Video Editor Pro' },
    owner: {
      id: '11',
      image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=11',
      name: 'Kevin Hart',
    },
    initiative: { id: '1', name: 'AI Integration' },
    release: { id: '4', name: 'v1.3' },
  },
  {
    id: '12',
    name: 'Real-time Project Analytics',
    startAt: startOfMonth(addMonths(today, 5)),
    endAt: endOfMonth(addMonths(today, 6)),
    status: exampleStatuses[2],
    group: { id: '3', name: 'Cloud Infrastructure' },
    product: { id: '1', name: 'Video Editor Pro' },
    owner: {
      id: '12',
      image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=12',
      name: 'Lara Croft',
    },
    initiative: { id: '3', name: 'Cloud Migration' },
    release: { id: '5', name: 'v1.4' },
  },
  {
    id: '13',
    name: 'AI Scene Recommendations',
    startAt: startOfMonth(addMonths(today, 6)),
    endAt: endOfMonth(addMonths(today, 7)),
    status: exampleStatuses[0],
    group: { id: '1', name: 'Core AI Features' },
    product: { id: '1', name: 'Video Editor Pro' },
    owner: {
      id: '13',
      image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=13',
      name: 'Michael Scott',
    },
    initiative: { id: '1', name: 'AI Integration' },
    release: { id: '5', name: 'v1.4' },
  },
  {
    id: '14',
    name: 'Collaborative Storyboarding',
    startAt: startOfMonth(addMonths(today, 7)),
    endAt: endOfMonth(addMonths(today, 8)),
    status: exampleStatuses[1],
    group: { id: '2', name: 'Collaboration Tools' },
    product: { id: '1', name: 'Video Editor Pro' },
    owner: {
      id: '14',
      image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=14',
      name: 'Natalie Portman',
    },
    initiative: { id: '2', name: 'Real-time Collaboration' },
    release: { id: '5', name: 'v1.4' },
  },
  {
    id: '15',
    name: 'AI-Driven Video Compression',
    startAt: startOfMonth(addMonths(today, 8)),
    endAt: endOfMonth(addMonths(today, 9)),
    status: exampleStatuses[2],
    group: { id: '1', name: 'Core AI Features' },
    product: { id: '1', name: 'Video Editor Pro' },
    owner: {
      id: '15',
      image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=15',
      name: 'Oscar Isaac',
    },
    initiative: { id: '1', name: 'AI Integration' },
    release: { id: '6', name: 'v1.5' },
  },
  {
    id: '16',
    name: 'Global CDN Integration',
    startAt: startOfMonth(addMonths(today, 9)),
    endAt: endOfMonth(addMonths(today, 10)),
    status: exampleStatuses[0],
    group: { id: '3', name: 'Cloud Infrastructure' },
    product: { id: '1', name: 'Video Editor Pro' },
    owner: {
      id: '16',
      image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=16',
      name: 'Penelope Cruz',
    },
    initiative: { id: '3', name: 'Cloud Migration' },
    release: { id: '6', name: 'v1.5' },
  },
  {
    id: '17',
    name: 'AI Object Tracking',
    startAt: startOfMonth(addMonths(today, 10)),
    endAt: endOfMonth(addMonths(today, 11)),
    status: exampleStatuses[1],
    group: { id: '1', name: 'Core AI Features' },
    product: { id: '1', name: 'Video Editor Pro' },
    owner: {
      id: '17',
      image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=17',
      name: 'Quentin Tarantino',
    },
    initiative: { id: '1', name: 'AI Integration' },
    release: { id: '6', name: 'v1.5' },
  },
  {
    id: '18',
    name: 'Real-time Language Translation',
    startAt: startOfMonth(addMonths(today, 11)),
    endAt: endOfMonth(addMonths(today, 12)),
    status: exampleStatuses[2],
    group: { id: '2', name: 'Collaboration Tools' },
    product: { id: '1', name: 'Video Editor Pro' },
    owner: {
      id: '18',
      image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=18',
      name: 'Rachel Green',
    },
    initiative: { id: '2', name: 'Real-time Collaboration' },
    release: { id: '7', name: 'v1.6' },
  },
  {
    id: '19',
    name: 'AI-Powered Video Summarization',
    startAt: startOfMonth(addMonths(today, 12)),
    endAt: endOfMonth(addMonths(today, 13)),
    status: exampleStatuses[0],
    group: { id: '1', name: 'Core AI Features' },
    product: { id: '1', name: 'Video Editor Pro' },
    owner: {
      id: '19',
      image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=19',
      name: 'Samuel L. Jackson',
    },
    initiative: { id: '1', name: 'AI Integration' },
    release: { id: '7', name: 'v1.6' },
  },
  {
    id: '20',
    name: 'Blockchain-based Asset Licensing',
    startAt: startOfMonth(addMonths(today, 13)),
    endAt: endOfMonth(addMonths(today, 14)),
    status: exampleStatuses[1],
    group: { id: '3', name: 'Cloud Infrastructure' },
    product: { id: '1', name: 'Video Editor Pro' },
    owner: {
      id: '20',
      image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=20',
      name: 'Tom Hanks',
    },
    initiative: { id: '3', name: 'Cloud Migration' },
    release: { id: '7', name: 'v1.6' },
  },
];

export const exampleMarkers = [
  {
    id: '1',
    date: startOfMonth(subMonths(today, 3)),
    label: 'Project Kickoff',
    className: 'bg-blue-100 text-blue-900',
  },
  {
    id: '2',
    date: subMonths(endOfMonth(today), 2),
    label: 'Phase 1 Completion',
    className: 'bg-green-100 text-green-900',
  },
  {
    id: '3',
    date: startOfMonth(addMonths(today, 3)),
    label: 'Beta Release',
    className: 'bg-purple-100 text-purple-900',
  },
  {
    id: '4',
    date: endOfMonth(addMonths(today, 6)),
    label: 'Version 1.0 Launch',
    className: 'bg-red-100 text-red-900',
  },
  {
    id: '5',
    date: startOfMonth(addMonths(today, 9)),
    label: 'User Feedback Review',
    className: 'bg-orange-100 text-orange-900',
  },
  {
    id: '6',
    date: endOfMonth(addMonths(today, 12)),
    label: 'Annual Performance Evaluation',
    className: 'bg-teal-100 text-teal-900',
  },
];

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric'
});

const Example = () => {
  const [features, setFeatures] = useState(exampleFeatures);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const status = exampleStatuses.find((status) => status.name === over.id);

    if (!status) {
      return;
    }

    setFeatures(
      features.map((feature) => {
        if (feature.id === active.id) {
          return { ...feature, status };
        }

        return feature;
      })
    );
  };

  return (
    <KanbanProvider onDragEnd={handleDragEnd} className="p-4">
      {exampleStatuses.map((status) => (
        <KanbanBoard key={status.name} id={status.name}>
          <KanbanHeader name={status.name} color={status.color} />
          <KanbanCards>
            {features
              .filter((feature) => feature.status.name === status.name)
              .map((feature, index) => (
                <KanbanCard
                  key={feature.id}
                  id={feature.id}
                  name={feature.name}
                  parent={status.name}
                  index={index}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <p className="m-0 flex-1 font-medium text-sm">
                        {feature.name}
                      </p>
                      <p className="m-0 text-muted-foreground text-xs">
                        {feature.initiative.name}
                      </p>
                    </div>
                    {feature.owner && (
                      <Avatar className="h-4 w-4 shrink-0">
                        <AvatarImage src={feature.owner.image} />
                        <AvatarFallback>
                          {feature.owner.name?.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <p className="m-0 text-muted-foreground text-xs">
                    {shortDateFormatter.format(feature.startAt)} -{' '}
                    {dateFormatter.format(feature.endAt)}
                  </p>
                </KanbanCard>
              ))}
          </KanbanCards>
        </KanbanBoard>
      ))}
    </KanbanProvider>
  );
};

export default Example;