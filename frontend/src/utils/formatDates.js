import { formatDistanceToNow, format } from 'date-fns';

export const timeAgo = (date) => {
    try {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
        return 'some time ago';
    }
};

export const formatDate = (date) => {
    try {
        return format(new Date(date), 'MMM dd, yyyy');
    } catch {
        return '';
    }
};

export const formatTime = (date) => {
    try {
        return format(new Date(date), 'hh:mm a');
    } catch {
        return '';
    }
};
