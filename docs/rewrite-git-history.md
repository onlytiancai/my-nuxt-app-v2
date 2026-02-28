# 重写 Git Commit History

本文档介绍如何重写 Git commit history，包括修改 commit message 和合并 commit。

## 为什么需要重写历史

- Commit message 不清楚或不准确
- 有多个琐碎的 commit 需要合并
- 需要重新组织 commit 顺序
- 需要删除敏感的提交

## ⚠️ 重要警告

**重写已推送到远程的历史后，必须使用 force push**。这会影响其他协作者，请谨慎使用：

- 确保团队其他成员知晓
- 最好在个人分支或主分支早期进行
- 使用 `--force-with-lease` 而非 `--force` 更安全

## 方法一：修改最近 N 个 commit 的 message

### 使用交互式 rebase

```bash
# 修改最近 3 个 commit
git rebase -i HEAD~3
```

这会打开编辑器，显示类似内容：

```
pick abc123 第一个 commit
pick def456 第二个 commit
pick ghi789 第三个 commit
```

将 `pick` 改为 `reword` 来修改对应 commit 的 message：

```
reword abc123 第一个 commit
pick def456 第二个 commit
pick ghi789 第三个 commit
```

保存后，Git 会逐个让你编辑 commit message。

## 方法二：批量自动重写 commit message

当需要重写大量 commit 时，手动编辑太麻烦。可以创建自动脚本来处理。

### 步骤

#### 1. 创建 commit message 编辑器脚本

```bash
cat > /tmp/git-commit-msg-editor << 'EOF'
#!/bin/bash
COUNTER_FILE="/tmp/commit_counter"

# 读取当前 message
ORIGINAL_MSG=$(cat "$1")

# 递增计数器
COUNT=$(cat "$COUNTER_FILE" 2>/dev/null || echo "0")
COUNT=$((COUNT + 1))
echo "$COUNT" > "$COUNTER_FILE"

# 定义 commit messages（从旧到新）
MESSAGES=(
"feat: 初始化项目"
"feat: 添加用户认证功能"
"fix: 修复登录 bug"
"docs: 更新 README"
"chore: 更新依赖"
)

# 写入新 message
IDX=$((COUNT - 1))
if [ $IDX -lt ${#MESSAGES[@]} ] && [ -n "${MESSAGES[$IDX]}" ]; then
    echo "${MESSAGES[$IDX]}" > "$1"
else
    echo "$ORIGINAL_MSG" > "$1"
fi
EOF

chmod +x /tmp/git-commit-msg-editor
```

#### 2. 创建 rebase todo 编辑器脚本

```bash
cat > /tmp/git-rebase-todo-editor << 'EOF'
#!/bin/bash
# 将所有的 pick 改为 reword，触发 commit message 编辑
sed -i '' 's/^pick/reword/g' "$1" 2>/dev/null || sed -i 's/^pick/reword/g' "$1"
EOF

chmod +x /tmp/git-rebase-todo-editor
```

#### 3. 重置计数器并执行 rebase

```bash
# 重置计数器
rm -f /tmp/commit_counter
echo "0" > /tmp/commit_counter

# 执行 rebase（从根 commit 开始）
GIT_SEQUENCE_EDITOR=/tmp/git-rebase-todo-editor \
GIT_EDITOR=/tmp/git-commit-msg-editor \
git rebase -i --root
```

#### 4. Force push 到远程

```bash
# 安全的方式（推荐）
git push --force-with-lease origin main

# 或者强制覆盖
git push --force origin main
```

## 方法三：使用 git filter-branch

适用于基于条件批量修改 commit message：

```bash
git filter-branch -f --msg-filter '
if git rev-parse $GIT_COMMIT | grep -q "abc123"; then
    echo "新的 commit message"
else
    cat
fi
' -- --all
```

## 方法四：修改单个 commit message

```bash
# 修改最近一次 commit
git commit --amend -m "新的 message"

# 修改历史中某个 commit（需要 rebase）
git rebase -i <commit-hash>^
# 将对应 commit 改为 edit，修改后 git commit --amend，然后 git rebase --continue
```

## 方法五：合并多个 commit

```bash
# 合并最近 3 个 commit 为 1 个
git rebase -i HEAD~3
```

将后两个 commit 的 `pick` 改为 `squash` 或 `fixup`：

```
pick abc123 第一个 commit
squash def456 第二个 commit  # 合并到上一个 commit
fixup ghi789 第三个 commit  # 合并到上一个 commit，丢弃 message
```

## 常用 commit message 约定

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` - 新功能
- `fix:` - Bug 修复
- `docs:` - 文档更新
- `style:` - 代码格式（不影响功能）
- `refactor:` - 代码重构
- `test:` - 测试相关
- `chore:` - 构建/工具/配置
- `ci:` - CI 配置
- `perf:` - 性能优化
- `build:` - 构建系统

## 恢复操作

如果 rebase 过程中出现问题：

```bash
# 中止 rebase
git rebase --abort

# 查看 reflog 找回之前的状态
git reflog

# 恢复到某个状态
git reset --hard HEAD@{n}
```

## 最佳实践

1. **尽早重写** - 在 commit 被他人拉取前重写历史
2. **保持原子性** - 每个 commit 应该是完整且独立的功能单元
3. **清晰的 message** - 说明 "为什么" 而不仅是 "是什么"
4. **团队沟通** - 重写公共历史前通知团队成员
5. **使用 `--force-with-lease`** - 比 `--force` 更安全

## 示例：完整流程

```bash
# 1. 查看当前历史
git log --oneline

# 2. 创建编辑器脚本
cat > /tmp/msg-editor << 'EOF'
#!/bin/bash
COUNTER_FILE="/tmp/commit_counter"
ORIGINAL_MSG=$(cat "$1")
COUNT=$(cat "$COUNTER_FILE" 2>/dev/null || echo "0")
COUNT=$((COUNT + 1))
echo "$COUNT" > "$COUNTER_FILE"

MESSAGES=(
"feat: 初始化项目"
"feat: 添加登录功能"
"fix: 修复样式问题"
)

IDX=$((COUNT - 1))
if [ $IDX -lt ${#MESSAGES[@]} ] && [ -n "${MESSAGES[$IDX]}" ]; then
    echo "${MESSAGES[$IDX]}" > "$1"
else
    echo "$ORIGINAL_MSG" > "$1"
fi
EOF
chmod +x /tmp/msg-editor

# 3. 重置计数器
rm -f /tmp/commit_counter
echo "0" > /tmp/commit_counter

# 4. 执行 rebase
GIT_EDITOR=/tmp/msg-editor git rebase -i --root

# 5. 确认历史正确
git log --oneline

# 6. Push 到远程
git push --force-with-lease origin main
```

## 方法六：手动逐个修正 commit message（最可靠）

当自动脚本不可靠时，可以手动逐个修正 commit message。这是最可靠的方法。

### 步骤

#### 1. 分析每个 commit 的实际改动

```bash
# 查看每个 commit 改动的文件
git log --reverse --oneline --format="%h %s" | while read hash msg; do
    echo "=== $hash: $msg ==="
    git show --name-only --format="" $hash
done
```

#### 2. 使用 rebase --exec 逐个修正

```bash
# 从需要修正的第一个 commit 的父 commit 开始
git rebase -i <commit-hash>^
```

在编辑器中，将需要修改的 commit 改为 `reword`：

```
reword abc123 旧的 message
pick def456 正确 message 的 commit
```

保存后，Git 会让你编辑 commit message。

#### 3. 或者使用 commit --amend

```bash
# 对于最近的 commit
git commit --amend -m "正确的 message"

# 对于历史中的 commit，先用 rebase edit
git rebase -i HEAD~10  # 改成 edit 需要修改的 commit
# 然后 amend
git commit --amend -m "正确的 message"
# 继续 rebase
git rebase --continue
```

## 实际案例分析

### 问题：自动化脚本导致 message 顺序错乱

在使用批量自动重写时，由于 git rebase 从旧到新处理 commits，而计数器递增顺序也
是从旧到新，但 message 数组的索引可能不匹配，导致 message 被分配到错误的 commit。

### 解决方案

1. **先分析每个 commit 的实际改动**
2. **使用交互式 rebase 手动修改**
3. **修改后立即验证**：`git show --stat HEAD`

### 验证命令

```bash
# 查看每个 commit 的 message 和改动文件
git log --oneline --format="%h %s" | while read hash msg; do
    echo "=== $hash: $msg ==="
    git show --name-only --format="" $hash | head -5
done
```
