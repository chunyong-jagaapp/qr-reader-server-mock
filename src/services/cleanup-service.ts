type CleanupTask = {
  name?: String;
  task: () => Promise<void> | void;
};

const cleanupTasks = new Set<CleanupTask>();

export const registerCleanupTask = (
  task: CleanupTask["task"],
  taskName?: string
) => {
  cleanupTasks.add({
    name: taskName ?? "",
    task,
  });
};

export const runCleanUp = async () => {
  for (const task of cleanupTasks) {
    try {
      console.log(`Running cleanup task: ${task.name}`);
      await task.task();
      console.log(`Cleanup task ${task.name} success`);
    } catch (err) {
      console.error(`Error during cleanup task ${task.name}: `, err);
    }
  }
};
