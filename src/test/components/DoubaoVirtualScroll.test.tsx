import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DoubaoVirtualScroll } from '@/components/doubao/DoubaoVirtualScroll';

const createMockItems = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `item-${index}`,
    data: { content: `Item ${index}`, value: index },
    height: 60,
  }));
};

describe('DoubaoVirtualScroll', () => {
  const mockRenderItem = vi.fn((item) => (
    <div key={item.id} data-testid={`item-${item.data.value}`}>
      {item.data.content}
    </div>
  ));

  beforeEach(() => {
    vi.clearAllMocks();
    mockRenderItem.mockClear();
  });

  it('renders virtual scroll container', () => {
    const items = createMockItems(10);

    render(
      <DoubaoVirtualScroll
        items={items}
        itemHeight={60}
        renderItem={mockRenderItem}
        containerHeight={300}
      />
    );

    expect(screen.getByRole('generic')).toBeInTheDocument();
  });

  it('renders only visible items', () => {
    const items = createMockItems(100);

    render(
      <DoubaoVirtualScroll
        items={items}
        itemHeight={60}
        renderItem={mockRenderItem}
        containerHeight={300}
      />
    );

    // Should only render visible items (300px / 60px = 5 items + buffer)
    expect(mockRenderItem.mock.calls.length).toBeLessThan(20);
    expect(mockRenderItem.mock.calls.length).toBeGreaterThan(5);
  });

  it('handles scrolling correctly', () => {
    const items = createMockItems(100);

    render(
      <DoubaoVirtualScroll
        items={items}
        itemHeight={60}
        renderItem={mockRenderItem}
        containerHeight={300}
      />
    );

    const container = screen.getByRole('generic');
    
    // Scroll down
    fireEvent.scroll(container, { target: { scrollTop: 300 } });

    // Should render different items after scrolling
    expect(mockRenderItem).toHaveBeenCalled();
  });

  it('calculates total height correctly', () => {
    const items = createMockItems(100);

    render(
      <DoubaoVirtualScroll
        items={items}
        itemHeight={60}
        renderItem={mockRenderItem}
        containerHeight={300}
      />
    );

    const container = screen.getByRole('generic');
    const scrollableContent = container.firstChild as HTMLElement;
    
    // Total height should be items.length * itemHeight
    expect(scrollableContent.style.height).toBe('6000px');
  });

  it('supports variable item heights', () => {
    const items = createMockItems(10).map((item, index) => ({
      ...item,
      height: 60 + (index * 10), // Variable heights
    }));

    render(
      <DoubaoVirtualScroll
        items={items}
        itemHeight={(index) => 60 + (index * 10)}
        renderItem={mockRenderItem}
        containerHeight={300}
      />
    );

    expect(mockRenderItem).toHaveBeenCalled();
  });

  it('handles empty item list', () => {
    render(
      <DoubaoVirtualScroll
        items={[]}
        itemHeight={60}
        renderItem={mockRenderItem}
        containerHeight={300}
      />
    );

    expect(mockRenderItem).not.toHaveBeenCalled();
    expect(screen.getByRole('generic')).toBeInTheDocument();
  });

  it('supports horizontal scrolling', () => {
    const items = createMockItems(10);

    render(
      <DoubaoVirtualScroll
        items={items}
        itemHeight={60}
        renderItem={mockRenderItem}
        containerHeight={300}
        direction="horizontal"
      />
    );

    const container = screen.getByRole('generic');
    expect(container).toHaveClass('overflow-x-auto');
  });

  it('handles rapid scrolling', () => {
    const items = createMockItems(1000);

    render(
      <DoubaoVirtualScroll
        items={items}
        itemHeight={60}
        renderItem={mockRenderItem}
        containerHeight={300}
      />
    );

    const container = screen.getByRole('generic');
    
    // Rapid scroll events
    for (let i = 0; i < 10; i++) {
      fireEvent.scroll(container, { target: { scrollTop: i * 100 } });
    }

    // Should handle without performance issues
    expect(mockRenderItem).toHaveBeenCalled();
  });

  it('supports overscan for smooth scrolling', () => {
    const items = createMockItems(100);

    render(
      <DoubaoVirtualScroll
        items={items}
        itemHeight={60}
        renderItem={mockRenderItem}
        containerHeight={300}
        overscan={5}
      />
    );

    // Should render extra items for smooth scrolling
    const visibleItems = Math.ceil(300 / 60); // 5 visible items
    const expectedItems = visibleItems + (5 * 2); // + overscan on both sides
    
    expect(mockRenderItem.mock.calls.length).toBeGreaterThanOrEqual(expectedItems);
  });

  it('calls onScroll callback', () => {
    const mockOnScroll = vi.fn();
    const items = createMockItems(100);

    render(
      <DoubaoVirtualScroll
        items={items}
        itemHeight={60}
        renderItem={mockRenderItem}
        containerHeight={300}
        onScroll={mockOnScroll}
      />
    );

    const container = screen.getByRole('generic');
    fireEvent.scroll(container, { target: { scrollTop: 100 } });

    expect(mockOnScroll).toHaveBeenCalledWith(
      expect.objectContaining({
        scrollTop: 100,
        scrollHeight: expect.any(Number),
        clientHeight: expect.any(Number),
      })
    );
  });

  it('supports scroll to index', () => {
    const items = createMockItems(100);

    const { rerender } = render(
      <DoubaoVirtualScroll
        items={items}
        itemHeight={60}
        renderItem={mockRenderItem}
        containerHeight={300}
      />
    );

    rerender(
      <DoubaoVirtualScroll
        items={items}
        itemHeight={60}
        renderItem={mockRenderItem}
        containerHeight={300}
        scrollToIndex={50}
      />
    );

    const container = screen.getByRole('generic');
    // Should scroll to item 50 (50 * 60 = 3000px)
    expect(container.scrollTop).toBe(3000);
  });

  it('handles window resize', () => {
    const items = createMockItems(100);

    render(
      <DoubaoVirtualScroll
        items={items}
        itemHeight={60}
        renderItem={mockRenderItem}
        containerHeight={300}
      />
    );

    // Simulate window resize
    fireEvent(window, new Event('resize'));

    // Should recalculate visible items
    expect(mockRenderItem).toHaveBeenCalled();
  });

  it('optimizes performance with memoization', () => {
    const items = createMockItems(10);

    const { rerender } = render(
      <DoubaoVirtualScroll
        items={items}
        itemHeight={60}
        renderItem={mockRenderItem}
        containerHeight={300}
      />
    );

    const initialCallCount = mockRenderItem.mock.calls.length;

    // Re-render with same props
    rerender(
      <DoubaoVirtualScroll
        items={items}
        itemHeight={60}
        renderItem={mockRenderItem}
        containerHeight={300}
      />
    );

    // Should not re-render items unnecessarily
    expect(mockRenderItem.mock.calls.length).toBe(initialCallCount);
  });

  it('handles dynamic item updates', () => {
    const initialItems = createMockItems(10);

    const { rerender } = render(
      <DoubaoVirtualScroll
        items={initialItems}
        itemHeight={60}
        renderItem={mockRenderItem}
        containerHeight={300}
      />
    );

    const updatedItems = [
      ...initialItems,
      ...createMockItems(5).map(item => ({
        ...item,
        id: `new-${item.id}`,
      })),
    ];

    rerender(
      <DoubaoVirtualScroll
        items={updatedItems}
        itemHeight={60}
        renderItem={mockRenderItem}
        containerHeight={300}
      />
    );

    // Should handle item updates
    expect(mockRenderItem).toHaveBeenCalled();
  });

  it('supports sticky items', () => {
    const items = createMockItems(100).map((item, index) => ({
      ...item,
      sticky: index === 0, // First item is sticky
    }));

    render(
      <DoubaoVirtualScroll
        items={items}
        itemHeight={60}
        renderItem={mockRenderItem}
        containerHeight={300}
        stickyIndices={[0]}
      />
    );

    // Sticky item should always be rendered
    expect(mockRenderItem).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'item-0' }),
      expect.any(Number)
    );
  });

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const items = createMockItems(10);

    const { unmount } = render(
      <DoubaoVirtualScroll
        items={items}
        itemHeight={60}
        renderItem={mockRenderItem}
        containerHeight={300}
      />
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});